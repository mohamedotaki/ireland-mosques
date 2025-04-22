import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { usePopup } from '../hooks/PopupContext';
import Editor from './text editor/Editor';
import { apiPost, apiPut } from '../utils/api';
import { Button } from '@mui/material';
import { PostType } from '../types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: "600px",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1.6,
};

interface NewPostModalProps {
  openModal: boolean;
  handleClose: () => void;
  postToEdit?: PostType | null;
  handleSubmit: (post: PostType, action: "new" | "edit") => void;

}




export default function NewPostModal({ openModal, handleSubmit, handleClose, postToEdit = null }: NewPostModalProps) {
  const { showPopup } = usePopup()
  const [post, setPost] = useState<PostType>(postToEdit || { contant: "" });



  const handleChange = (contant: string) => {
    setPost({ ...post, contant })
  }



  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box borderRadius={5} maxWidth={"90%"} sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h3" textAlign={"center"} mb={1}>
          {postToEdit ? "Edit Post" : "New Post"}
        </Typography>

        <Editor
          editorContent={post.contant}
          setEditorContent={handleChange}

        />
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
          <Button onClick={() => handleSubmit(post, postToEdit ? "edit" : "new")} variant="contained">Post</Button>
        </div>

      </Box>
    </Modal>
  );
}