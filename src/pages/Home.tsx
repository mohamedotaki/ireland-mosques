import { Container, IconButton, Typography } from "@mui/material";
import CustomCard from "../components/CustomCard";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import Editor from "../components/text editor/Editor";
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from "../hooks/AuthContext";

export default function Home() {
  const [addNewPost, setAddNewPost] = useState<boolean>(false)
  const [newPost, setNewPost] = useState<string>("");
  const { user } = useAuth()

  useEffect(() => {
    setNewPost("")
  }, [addNewPost])

  return (
    <>
      <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Typography variant="h4" >
          News
        </Typography>
        {(user?.userType === "Admin" || user?.userType === "Owner") && <IconButton onClick={() => setAddNewPost((i) => !i)}>
          {addNewPost ? <RemoveIcon fontSize="medium" /> : <AddIcon fontSize="medium" />}
        </IconButton>}
      </Container>

      {addNewPost && <Editor
        editorContent={newPost}
        setEditorContent={setNewPost}

      />}


      <CustomCard content={newPost} />

    </>


  );
}
;
