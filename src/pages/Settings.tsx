import React, { useState } from 'react';
import { Typography, FormControl, Select, MenuItem, Grid, Card } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '../hooks/ThemeContext';
import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from '../utils/localDB';
import { useTranslation } from 'react-i18next';
import Slider from '@mui/material/Slider';

// Define types for the state
type Language = 'en' | 'ar';
type Theme = 'light' | 'dark' | 'system_default';
type TimeFormat = '12-h' | '24-h';
type FontSize = number;


const SettingsPage: React.FC = () => {
  const { selectedTheme, toggleTheme, changeFontSize } = useTheme();
  const { t, i18n } = useTranslation();
  const marks = [
    {
      value: 10,
      label: 'Small',
    },
    {
      value: 15,
      label: 'Normal',
    },
    {
      value: 20,
      label: 'Larg',
    },

  ];


  const [language, setLanguage] = useState<Language>(i18n.language as Language);
  const [fontSize, setFontSize] = useState<FontSize>(getFromLocalDB(LocalStorageKeys.FontSize) || 14);

  const [timeFormat, setTimeFormat] = useState<TimeFormat>(getFromLocalDB(LocalStorageKeys.TimeFormatIs24H) ? '24-h' : '12-h');

  const handleLanguageChange = (event: SelectChangeEvent<Language>) => {
    setLanguage(event.target.value as Language);
    saveToLocalDB(LocalStorageKeys.AppLanguage, event.target.value)
    i18n.changeLanguage(event.target.value); // Change language dynamically
  };

  const handleThemeChange = (event: SelectChangeEvent<Theme>) => {
    toggleTheme(event.target.value as Theme)
  };

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number); // Update font size
    changeFontSize(newValue as number)
    saveToLocalDB(LocalStorageKeys.FontSize, newValue);
  };

  const handleTimeFormatChange = (event: SelectChangeEvent<TimeFormat>) => {
    const newFormat = event.target.value
    if (timeFormat !== newFormat) {
      saveToLocalDB(LocalStorageKeys.TimeFormatIs24H, newFormat === '24-h' ? true : false)
      setTimeFormat(newFormat as TimeFormat);
    }

  };

  function valuetext(value: number) {
    return `${value}°C`;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2, mt: 2 }}>
      <Typography variant="h6" textAlign="center" sx={{ mb: 2 }} >
        General
      </Typography>


      <Grid container spacing={3}>
        <Grid item xs={12} container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1">Language</Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Select value={language} onChange={handleLanguageChange}>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>

              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item xs={12} container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1">Theme</Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Select value={selectedTheme} onChange={handleThemeChange}>
                <MenuItem value="system_default">System Default</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="light">Light</MenuItem>

              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item xs={12} container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1">Time Format</Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Select value={timeFormat} onChange={handleTimeFormatChange}>
                <MenuItem value="12-h">12-hour</MenuItem>
                <MenuItem value="24-h">24-hour</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1">Font Size</Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Slider
                aria-label="Font Size"
                defaultValue={14}
                valueLabelDisplay="auto"
                value={fontSize}
                step={1}
                marks={marks}
                min={10}
                max={20}
                onChange={handleFontSizeChange}

              />
            </FormControl>
          </Grid>
        </Grid>




      </Grid>
    </Card>
  );
};

export default SettingsPage;
