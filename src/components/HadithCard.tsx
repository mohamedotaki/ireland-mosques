import { useState, useEffect, useCallback, memo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import en from "../assets/eng-bukhari.json";
import ar from "../assets/ara-bukhari.json";
import { useTranslation } from 'react-i18next';


interface HadithData {
  metadata: {
    name: string;
  };
  hadiths: {
    hadithnumber: number;
    text: string;
  }[];
}

const HadithCard = memo(() => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar"
  const hadiths: HadithData = i18n.language === "ar" ? ar : en
  // Initialize the hadithIndex from localStorage, defaulting to 0 if not found
  const [hadithIndex, setHadithIndex] = useState<number>(
    () => Number(localStorage.getItem('hadith-index')) || 0
  );

  // Update localStorage only when the state changes
  const handleHadithRed = useCallback(() => {
    const newIndex = hadithIndex + 1;
    localStorage.setItem('hadith-index', newIndex.toString());
    setHadithIndex(newIndex);
  }, [hadithIndex]);

  return (
    <Card sx={{ minWidth: 275, my: 1, direction: isArabic ? "rtl" : "ltr" }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {`${hadiths.metadata.name} - No: ${hadiths.hadiths[hadithIndex].hadithnumber}`}
        </Typography>
        <Typography variant="body2">
          {hadiths.hadiths[hadithIndex].text}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: -2, justifyContent: "right" }}>
        <Button onClick={handleHadithRed} size="small">{t("Mark As Read")}</Button>
      </CardActions>
    </Card>
  );
});

export default HadithCard;
