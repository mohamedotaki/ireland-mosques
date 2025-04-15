import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { mosquesDatabaseType } from '../types';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1.6,


};

interface PrayerModalProps {
  openModal: boolean;
  mosqueInfo: mosquesDatabaseType;
  handleClose: () => void;


}

interface UpdatedPrayer {
  mosqueId: number;
  prayerId: number;
  isIqamahClicked: boolean;
  iqamahOffset: number | null;
  iqamahTime: Date | null;
  adhanTime: Date | null;
}

export default function MosqueInfoModal({ mosqueInfo, openModal, handleClose }: PrayerModalProps) {
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(mosqueInfo.address + ' ' + mosqueInfo.eircode)}`;
  const telUrl = `tel:${mosqueInfo.contact_number}`;
  const mosqueUrl = `${mosqueInfo.website}`;


  console.log("mosque info modal rendering")

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box borderRadius={5} width={"100%"} maxWidth={500} maxHeight={"80%"} overflow={"auto"} sx={style}>
        <Typography variant="h5" align='center' my={1}>{mosqueInfo.name}</Typography>
        <Divider />

        <InfoItem
          itemName='Status:'
          value={"Active"}
        />
        <InfoItem
          itemName='Last Update:'
          value={"10/20/2025"}
        />

        <InfoItem
          itemName='Address:'
          value={<a href={googleMapsUrl}
            target="_blank" rel="noopener noreferrer">
            {mosqueInfo.address}, {mosqueInfo.eircode}
          </a>}
        />

        <InfoItem itemName='IBAN:' value={mosqueInfo.iban || "N/A"} />
        <InfoItem
          itemName='Contact No:'
          value={<a href={telUrl} >
            {mosqueInfo.contact_number.toString()}
          </a>} />
        <InfoItem
          itemName='Website:'
          value={<a href={mosqueUrl} >
            {mosqueInfo.website || "N/A"}
          </a>} />
        <InfoItem
          itemName='Feedback:'
          value={<TextField
            id="outlined-multiline-static"
            label={"Feedback to " + mosqueInfo.name}
            multiline
          />} />
        <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          <Button onClick={handleClose}>Send Feedback</Button>
        </Grid>

      </Box>
    </Modal>
  );
}


interface InfoItemType {
  itemName: string;
  value: string | React.ReactNode;
}

const InfoItem = ({ itemName, value }: InfoItemType) => {

  return (
    <Grid container size={12} my={2.5}>
      <Grid size={4}>
        <Typography >{itemName}</Typography>
      </Grid>
      <Grid size={8}>
        <Typography  >{value}</Typography>
      </Grid>
    </Grid>


  )
}