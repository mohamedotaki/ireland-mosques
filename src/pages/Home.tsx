import { Box, Button, Container, Typography } from "@mui/material";
import CustomCard from "../components/CustomCard";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import NewPostModal from "../components/NewPostModal";
import { apiGet } from "../utils/api";
import { PostType } from "../types";
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [postToEdit, setPostToEdit] = useState<PostType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth()
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false)


  console.log(posts)
  useEffect(() => {
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

    getPosts()

  }, [])


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
                      <CustomCard key={post.postID} content={post.contant} />
                    ))}
                    {/*                     < Pagination count={3} color="primary" />
 */}                  </>

                )
        }

      </Box>

      {showNewPostModal && <NewPostModal openModal={showNewPostModal} handleClose={() => setShowNewPostModal(false)} postToEdit={postToEdit} />}


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