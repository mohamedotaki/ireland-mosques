import React, { useEffect, useState } from 'react';
import { Typography, FormControl, Select, MenuItem, Grid2 as Grid, Card, TextField, Button } from '@mui/material';
import { useTheme } from '../hooks/ThemeContext';
import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from '../utils/localDB';
import { useTranslation } from 'react-i18next';
import Slider from '@mui/material/Slider';
import { settingsType } from '../types/authTyps';
import debounce from 'lodash/debounce';
import { apiPut } from '../utils/api';
import isEqual from 'lodash/isEqual';
import { useAuth } from '../hooks/AuthContext';
import { mosquesDatabaseType } from '../types';


const SettingsPage: React.FC = () => {

  const hasMounted = React.useRef(false);
  const { theme, toggleTheme, changeFontSize } = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<settingsType>(getFromLocalDB(LocalStorageKeys.AppSettings) || {
    theme: 'system_default',
    language: i18n.language,
    fontSize: 14,
    timeFormatIs24H: true,
    defaultMosque: null,

  });

  const prevSettings = React.useRef(settings);
  const marks = [
    {
      value: 10,
    },
    {
      value: 15,
    },
    {
      value: 20,
    },

  ];



  const isArabic = i18n.language === "ar" || i18n.language === "ud"

  const handleSettingsChange = (event: any) => {
    console.log("handleSettingsChange")
    setSettings((oldSettings) => {
      const newSettings = { ...oldSettings, [event.target.name]: event.target.value }
      saveToLocalDB(LocalStorageKeys.AppSettings, newSettings)
      return newSettings
    });

  };

  // Optional: debounce the API call so it's not sent every keystroke
  const saveSettings = debounce(async (updatedSettings: settingsType) => {
    const { data, error } = await apiPut('/auth/settings', { updatedSettings })
    console.log("saveSettings", data, error)
  }, 1000); // 1-second delay

  // Watch for changes in settings and trigger save
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      prevSettings.current = settings;
      return; // skip first run
    }
    if (!isEqual(prevSettings.current, settings)) {
      if (settings.theme !== prevSettings.current.theme) {
        toggleTheme(settings.theme)
      }
      if (settings.fontSize !== prevSettings.current.fontSize) {
        changeFontSize(settings.fontSize)
      }
      if (settings.language !== prevSettings.current.language) {
        i18n.changeLanguage(settings.language)
      }
      prevSettings.current = settings;
      if (user) {
        saveSettings(settings);
      }
    }
    // Cleanup: cancel debounce on unmount
    return () => {
      saveSettings.cancel();
    };



  }, [settings]);

  return (
    <>
      <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2, mt: 2, direction: isArabic ? "rtl" : "ltr" }}>
        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
          General
        </Typography>

        <Grid container spacing={3}>
          {/* Language Selection */}
          <Grid size={12} container>
            <Grid size={6}>
              <Typography variant="body1">{t("Language")}</Typography>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <Select name='language' value={settings.language} onChange={handleSettingsChange}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ar">العربية</MenuItem>
                  <MenuItem value="ud">اردو</MenuItem>


                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Theme Selection */}
          <Grid size={12} container alignItems="center">
            <Grid size={6}>
              <Typography variant="body1">{t("Theme")}</Typography>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <Select value={theme} name='theme' onChange={handleSettingsChange}>
                  <MenuItem value="system_default">{t("System Default")}</MenuItem>
                  <MenuItem value="dark">{t("Dark")}</MenuItem>
                  <MenuItem value="light">{t("Light")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Time Format Selection */}
          <Grid size={12} container alignItems="center">
            <Grid size={6}>
              <Typography variant="body1">{t("Time Format")}</Typography>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <Select value={settings.timeFormatIs24H ? "24-h" : "12-h"} name='timeFormatIs24H' onChange={(e) => handleSettingsChange({ ...e, target: { name: 'timeFormatIs24H', value: e.target.value === "24-h" ? true : false } })}>
                  <MenuItem value="12-h">{t("12-hour")}</MenuItem>
                  <MenuItem value="24-h">{t("24-hour")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Font Size Slider */}
          <Grid size={12} container alignItems="center">
            <Grid size={6}>
              <Typography variant="body1">{t("Font Size")}</Typography>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <Slider
                  name='fontSize'
                  aria-label="Font Size"
                  defaultValue={14}
                  value={settings.fontSize}
                  valueLabelDisplay="auto"
                  step={1}
                  marks={marks}
                  min={10}
                  max={20}
                  onChange={handleSettingsChange}
                  sx={{
                    '& .MuiSlider-thumb': {
                      marginRight: "-10%"
                    },
                    '& .MuiSlider-track': {
                      direction: 'ltr', // Flip the track in RTL mode
                    },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>


      </Card>





      {/*     <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2, mt: 2, direction: isArabic ? "rtl" : "ltr" }}>
        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
          Contact Us
        </Typography>

        <Grid size={12} container alignItems="center">
          <Grid size={6}>
            <Typography variant="body1">{t("Rate us")}</Typography>
          </Grid>
          <Grid size={6}>

          </Grid>
        </Grid>

        <Grid container spacing={3}>
      <Grid size={12} container justifyContent="center">
        <Grid size={12} >
          <Typography variant="body1" textAlign={"center"}>{t("Leave us a feedback")}</Typography>
          <TextField fullWidth label="Feedback" id="fullWidth" rows={2} multiline />
          <Button variant="text">Send Feedback</Button>

        </Grid>
      </Grid>
    </Grid >


      </Card > */}
      {/* Display App Version at the bottom */}
      <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ mt: 4 }}>
        Version: {process.env.REACT_APP_VERSION} {/* Access the version from .env */}
      </Typography>
    </>
  );
};

export default SettingsPage;
