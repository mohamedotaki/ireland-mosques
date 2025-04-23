import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify'; // For sanitization
import { PostType } from '../../types';
import "./editor.css"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import moment from 'moment';
import { settingsType } from '../../types/authTyps';
import { getFromLocalDB, LocalStorageKeys } from '../../utils/localDB';


interface PostProps {
  post: PostType;
  handlePostChange: (post: PostType, action: "toEdit" | "delete") => void;
  isAdmin: boolean;

}

export default function CustomCard({ post, handlePostChange, isAdmin = false }: PostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sanitizedContent = DOMPurify.sanitize(post.content);
  const settings: settingsType = getFromLocalDB(LocalStorageKeys.AppSettings)
  const timeFormat = settings.timeFormatIs24H ? "HH:mm" : "h:mm A"

  // Function to handle "Read More" toggle
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Check content length and calculate if the "Show More" button should appear
  const checkIfShouldShowButton = () => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const maxHeight = 250; // Max height for the truncated content
      setShouldShowButton(contentHeight > maxHeight);
    }
  };


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Limit content to a specific height (approx. 7 lines) when collapsed
  const contentStyle = {
    display: '-webkit-box',
    WebkitLineClamp: isExpanded ? 'none' : 7, // Limit to 7 lines unless expanded
    WebkitBoxOrient: 'vertical' as const, // Type assertion to fix TypeScript error
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.2', // Adjust line height to reduce the spacing
    maxHeight: isExpanded ? 'none' : '250px', // Apply maxHeight when collapsed
  };


  useEffect(() => {
    checkIfShouldShowButton();
  }, [sanitizedContent]);

  return (
    <Card sx={{ minWidth: 275, my: 2, width: "100%", maxWidth: "600px", position: 'relative' }}>
      {isAdmin && <>

        <IconButton
          id="menu-button"
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'menu-button',
          }}
        >
          <MenuItem onClick={() => handlePostChange(post, "toEdit")}>Edit Post</MenuItem>
          <MenuItem onClick={() => handlePostChange(post, "delete")}>Delete</MenuItem>
        </Menu>

      </>
      }

      <CardContent>
        <div
          className='post_view'
          ref={contentRef} // Reference the content element for height checking
          style={contentStyle} // Apply truncation style
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Render sanitized raw HTML
        />
      </CardContent>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ position: "absolute", bottom: 8, right: 8 }}
      >
        {moment(post.create_time).format(`${timeFormat} - DD/MM/yy`)}
        {!post.mosque_id && <br />}
        {!post.mosque_id && "By " + process.env.REACT_APP_NAME}
      </Typography>
      {shouldShowButton && (
        <CardActions>
          {/* Toggle "Read More" text based on expansion state */}
          <Button size="small" onClick={handleToggle}>
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
