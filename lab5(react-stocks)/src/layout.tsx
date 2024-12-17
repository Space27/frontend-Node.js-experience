import {Outlet, Link, useLocation} from "react-router-dom";
import {Box, Tab, Tabs} from "@mui/material";
import './layout.css';

function Layout() {
    const {pathname} = useLocation();

    return (
        <>
            <header className="header">
                <Link to="/" className="logo">
                    <img className="logo__image" src={process.env.PUBLIC_URL + '/img/logo.png'} alt="logo"/>
                    <h1 className="logo__title">ЛОНГ/ШОРТ</h1>
                </Link>

                <nav className="header__nav">
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={pathname}>
                            <Tab label="Брокеры" component={Link} to="/brokers" value="/brokers"/>
                            <Tab label="Акции" component={Link} to="/stocks" value="/stocks"/>
                            <Tab label="Торги" component={Link} to="/settings" value="/settings"/>
                        </Tabs>
                    </Box>
                </nav>
            </header>

            <Outlet/>
        </>
    )
}

export default Layout;