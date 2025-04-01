import { Button, Container, Typography } from "@mui/material";
import SignInSignUp from "../components/SignInSignUp";
import { useAuth } from "../hooks/AuthContext";
import { Outlet } from "react-router-dom";




export default function AccountPage() {

    const { user, signout } = useAuth()
    return user ? (
        <>
            <Container sx={{ minHeight: 350, px: 2, py: 5, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-around", gap: 2 }}>
                <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>{`Hello ${user?.name}`}</Typography>
                <Container sx={{ display: "flex", justifyContent: "space-around", flexDirection: "column", alignItems: "center", gap: 2, my: 4 }}>
                    <Button variant="text" size="large" >
                        Large
                    </Button>        <Button variant="text" size="large">
                        Large
                    </Button>        <Button variant="text" size="large">
                        Large
                    </Button>
                </Container>
                <Button variant="outlined" color="error" size="large" onClick={signout}>Logout</Button>
            </Container>
            {/*             <Outlet />
 */}        </>
    )
        : (
            <SignInSignUp />

        )








}

;
