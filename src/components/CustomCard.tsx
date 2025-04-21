import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify'; // For sanitization

export default function CustomCard({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sanitizedContent = DOMPurify.sanitize(content);


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
    // Check if the "Show More" button should be visible whenever the content changes
    checkIfShouldShowButton();
  }, [content]);

  return (
    <Card sx={{ minWidth: 275, my: 2, width: "100%", maxWidth: "600px" }}>
      <CardContent>
        <div
          ref={contentRef} // Reference the content element for height checking
          style={contentStyle} // Apply truncation style
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Render sanitized raw HTML
        />
      </CardContent>
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
