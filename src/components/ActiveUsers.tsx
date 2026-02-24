import { CircularProgress, Grid2, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';
import { ActiveUsersType } from '../types/user';


const time: (keyof ActiveUsersType)[] = ["day", "week", "month", "year", "allTime"];


export default function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<ActiveUsersType>({ day: "0", week: "0", month: "0", year: "0", allTime: "0" })
  const [error, setError] = useState<String>("")
  const [loading, setLoading] = useState<boolean>(true)

  const getActiveUsers = async () => {
    const { data, error } = await apiGet<ActiveUsersType>("app/active_users")
    if (data) {
      setActiveUsers(data)
      setLoading(false)

    } else {
      setError("Unable to get active users count")
      setLoading(false)

    }

  }


  useEffect(() => {
    getActiveUsers()

  },
    [])




  return (error || loading) ?
    (
      <Grid2 container size={12} >
        <Grid2 size={12} alignContent={"center"} textAlign={"center"}>
          {loading && <CircularProgress />}
          <Typography color={error ? "error" : "info"}>{error ? error : `Loading Data`}</Typography>

        </Grid2>

      </Grid2>
    )

    : (
      <Grid2 container size={12}>
        <Grid2 size={12} alignContent={"center"} >
          <Typography gutterBottom variant="h6" color="primary" textAlign={"center"}>Active Users</Typography>
        </Grid2>
        {
          time.map((time) => (

            <Grid2 container size={4} mt={1} key={time}>
              <Grid2 size={12} alignContent={"center"} textAlign={"center"}>
                <Typography fontWeight={600}>{time}</Typography>
              </Grid2>
              <Grid2 size={12} textAlign={"center"}>
                <Typography>{`${activeUsers[time]}`}</Typography>
              </Grid2>
            </Grid2>

          ))
        }



      </Grid2>
    );
}
