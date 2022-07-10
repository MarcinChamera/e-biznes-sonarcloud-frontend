import React, { useEffect, useState } from "react";
import { AppBar, IconButton, Link, Toolbar, Typography } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header = () => {

    // const [numberOfProductsInBasket, setNumberOfProductsInBasket] = useState(0);

    // useEffect(() => {
    //     setNumberOfProductsInBasket(localStorage.length);
    // }, [localStorage.length])

    return (
        <header>
            <AppBar>
                <Toolbar>
                    <Typography>
                        <Link sx={{color:"white"}} href="/products">
                            Nameless Shop
                        </Link>
                    </Typography>
                    <div>
                        <IconButton aria-label="add to shopping cart" href="/shopping-cart">
                            <ShoppingCartIcon/>
                        </IconButton>
                    </div>
                    {/* <Typography>
                        {numberOfProductsInBasket}
                    </Typography> */}
                </Toolbar>
            </AppBar>
        </header>
    )
}

export default Header;