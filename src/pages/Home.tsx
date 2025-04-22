import { Box, Button, Container, Typography } from "@mui/material";
import CustomCard from "../components/text editor/CustomCard";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import NewPostModal from "../components/NewPostModal";
import { apiDelete, apiGet, apiPost, apiPut } from "../utils/api";
import { PostType } from "../types";
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { usePopup } from "../hooks/PopupContext";

export default function Home() {
  const { showPopup } = usePopup()

  const [posts, setPosts] = useState<PostType[]>([]);
  const [postToEdit, setPostToEdit] = useState<PostType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth()
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false)


  const getPosts = async () => {
    setLoading(true)
    const { data, error } = await apiGet<{ posts: PostType[] }>("posts")
    if (data) {
      setPosts(data.posts)
      setLoading(false)
    } else {
      setError(error)
      setLoading(false)
    }
  }

  useEffect(() => {


    getPosts()

  }, [])


  const handlePostChange = async (post: PostType, action: "edit" | "delete" | "new" | "toEdit") => {
    let response = null;
    switch (action) {
      case "toEdit":
        setPostToEdit(post)
        setShowNewPostModal(true)
        break;
      case "edit":
        response = await apiPut<{ post: PostType }, { message: string }>("posts", { post })
        break;
      case "delete":
        response = await apiDelete<{ message: string }>(`posts/${post.post_id}`)
        break;
      case "new":
        response = await apiPost<{ post: PostType }, { message: string }>("posts", { post })
        response?.data && setShowNewPostModal(false)
        break;
      default:
        break;
    }

    if (response) {
      response?.data && getPosts()
      showPopup({ message: response?.data?.message || response?.error || "Unknown error. Please try again", type: response?.data ? "success" : "error" })
    }
  }



  return (
    <>
      <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Typography variant="h4" >
          News
        </Typography>
        {(user?.userType === "Admin" || user?.userType === "Owner") && <Button startIcon={<AddIcon fontSize="medium" />} onClick={() => setShowNewPostModal((i) => !i)}>
          Add Post
        </Button>}
      </Container>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 2, mt: 3, flex: 1 }}>


        {
          loading ?
            Loading()
            : error ? <Typography color="error" variant="body1" sx={{ textAlign: "center", mt: 3 }}>{error}</Typography>
              : posts.length === 0 ? <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>No posts yet</Typography>
                : (
                  <>
                    {posts.map((post) => (
                      <CustomCard handlePostChange={handlePostChange} key={post.post_id} post={post} />
                    ))}
                    {/*                     < Pagination count={3} color="primary" />
 */}                  </>

                )
        }

      </Box>

      {showNewPostModal && <NewPostModal handleSubmit={handlePostChange} openModal={showNewPostModal} handleClose={() => setShowNewPostModal(false)} postToEdit={postToEdit} />}


    </>


  );
}
;


const Loading = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <CircularProgress />
      <Typography sx={{ textAlign: "center", mt: 3, fontSize: "15px" }}>Loading posts...</Typography>
    </Box>
  );
};