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
import { useUpdate } from "../hooks/UpdateContext";
import { getFromLocalDB, LocalStorageKeys } from "../utils/localDB";
import { settingsType } from "../types/authTyps";
import Verification from "../components/auth/Verification";
import Signin from "../components/auth/Signin";

export default function Home() {
  const { showPopup } = usePopup()
  const { defaultMosque } = useUpdate()
  const [posts, setPosts] = useState<PostType[]>([]);
  const [postToEdit, setPostToEdit] = useState<PostType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth()
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const settings: settingsType = getFromLocalDB(LocalStorageKeys.AppSettings)


  const getPosts = async (page: number) => {
    setLoading(true)
    const { data, error } = await apiGet<{ posts: PostType[], totalPages: number }>("posts", { mosqueID: defaultMosque.id, page })
    if (data) {
      setPosts(data.posts)
      setTotalPages(data.totalPages)
      setLoading(false)
    } else {
      setError(error)
      setLoading(false)
    }
  }

  useEffect(() => {


    getPosts(currentPage)

  }, [currentPage])


  const handlePostChange = async (post: PostType, action: "edit" | "delete" | "new" | "toEdit") => {
    let response = null;
    switch (action) {
      case "toEdit":
        setPostToEdit(post)
        setShowNewPostModal(true)
        break;
      case "edit":
        response = await apiPut<{ post: PostType }, { message: string }>("posts", { post })
        if (response?.data) {
          setPosts(posts.map(p => p.post_id === post.post_id ? post : p))
          setPostToEdit(null)
          setShowNewPostModal(false)
        }
        break;
      case "delete":
        response = await apiDelete<{ message: string }>(`posts/${post.post_id}`)
        if (response?.data) {
          posts.length === 1 ? setCurrentPage(currentPage - 1) : setPosts(posts.filter(p => p.post_id !== post.post_id))
        }
        break;
      case "new":
        console.log(post.content)
        post.content === "" ? response = { error: "Post content is required" } :
          response = await apiPost<{ post: PostType }, { message: string }>("posts", { post })
        if (response?.data) {
          setShowNewPostModal(false);
          getPosts(1);
        }
        break;
      default:
        break;
    }

    if (response) {
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mt: 3, flex: 1 }}>


        {
          loading ?
            Loading()
            : error ? <Typography color="error" variant="body1" sx={{ textAlign: "center", mt: 3 }}>{error}</Typography>
              : posts.length === 0 ? <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>No posts yet</Typography>
                : (
                  <>
                    {posts.map((post) => (
                      <CustomCard isAdmin={(user?.userType === "Admin" && post.mosque_id === user.mosqueID) || user?.userType === "Owner"} handlePostChange={handlePostChange} key={post.post_id} post={post} />
                    ))}
                    {< Pagination sx={{ direction: settings.language === "ar" ? "rtl" : "ltr" }} count={totalPages} page={currentPage} color="primary" onChange={(e, page) => setCurrentPage(page)} />}
                  </>

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