import { useState, useCallback, memo } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import en from "../assets/eng-bukhari.json";
import ar from "../assets/ara-bukhari.json";
import { useTranslation } from 'react-i18next';
import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from '../utils/localDB';


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
  console.log("Hadith Card Rendering")
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar"
  const hadiths: HadithData = i18n.language === "ar" ? ar : en
  // Initialize the hadithIndex from localStorage, defaulting to 0 if not found
  const [hadithIndex, setHadithIndex] = useState<number>(
    () => Number(getFromLocalDB(LocalStorageKeys.HadithIndex)) || 0
  );

  // Update localStorage only when the state changes
  const handleHadithRed = useCallback(() => {
    const newIndex = hadithIndex + 1;
    saveToLocalDB(LocalStorageKeys.HadithIndex, newIndex);
    setHadithIndex(newIndex);
  }, [hadithIndex]);

  return hadiths.hadiths[hadithIndex] ? (
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
  ) : <Typography variant="body2" textAlign={"center"} sx={{ my: 3 }}>You have reached the last hadith. New hadith will be added soon</Typography>;
});

export default HadithCard;
