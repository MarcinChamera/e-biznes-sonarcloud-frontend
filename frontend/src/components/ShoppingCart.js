import { Container, Typography, Box, Divider, CardMedia, Stack, Button, TextField, Grid } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import PaymentIcon from '@mui/icons-material/Payment';
import axios from "../axios/axios"
import { ShoppingCartContext } from "../context/ShoppingCartContext"
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function getTotalPrice(shoppingCartProducts) {
    var totalPrice = 0;
    shoppingCartProducts.forEach((shoppingCartProduct) => totalPrice += shoppingCartProduct["product"].Price * shoppingCartProduct["quantity"]);
    return totalPrice
}

const ShoppingCart = () => {
    const navigate = useNavigate();
    const [shoppingCartProducts, setShoppingCartProducts] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const {removeFromShoppingCart} = useContext(ShoppingCartContext);

    async function getShoppingCart() {
        var shoppingCart = []
        for (var shoppingCartProductId in localStorage) {
            if (localStorage.hasOwnProperty(shoppingCartProductId)) {
                await axios.get(`/products/${shoppingCartProductId}`).then(res => shoppingCart.push({product: res?.data, quantity: localStorage[shoppingCartProductId]}));
            }
        }
        setShoppingCartProducts(shoppingCart);
        setLoading(false);
    }

    useEffect(() => {
        getShoppingCart();
    }, [])
 
    function buyShoppingCartProducts() {
        const amountToPay = getTotalPrice(shoppingCartProducts);
        const paymentNumber = Math.floor(Math.random() * 1000000)
        return axios.post("/payment", { amountToPay, paymentNumber }).then((res) => {
            navigate("/payment", { state : {
                amountToPay: amountToPay,
                paymentNumber: paymentNumber
            }})
        });
    }

    function changeQuantity(id, newQuantity) {
        localStorage.setItem(JSON.stringify(id), newQuantity.target.value)
        getShoppingCart();
    }

    function remove(id) {
        removeFromShoppingCart(JSON.stringify(id));
        getShoppingCart();
    }

    return (
         <Container>
            <Typography variant="h4" marginTop={10}>
                W koszyku:
            </Typography>
            {isLoading ?
            (
                <Typography>
                    Ładowanie
                </Typography>
            ) : 
            (
                shoppingCartProducts.length === 0 ?
                (
                    <Typography marginTop={5}>
                        Koszyk jest pusty
                    </Typography>
                ) : 
                (shoppingCartProducts.map((shoppingCartProduct, index) => (
                    <Box key={index} marginTop={2}>
                        <CardMedia>
                            <img src={shoppingCartProduct["product"].image_url} height="100" alt={shoppingCartProduct["product"].image_url} />
                        </CardMedia>
                        <Typography>
                            {shoppingCartProduct["product"].Name}
                        </Typography>
                        <Typography marginBottom={2}>
                            {shoppingCartProduct["product"].Price} PLN
                        </Typography>
                        <Grid container direction="row" alignItems="center" spacing={1} marginBottom={2}>
                            <Grid item>
                                <TextField
                                    type="number"
                                    value={shoppingCartProduct["quantity"]}
                                    InputProps={{ inputProps: { min: 1, max: 99 } }}
                                    onChange={(newQuantity) => changeQuantity(shoppingCartProduct["product"].ID, newQuantity)}
                                />
                            </Grid>
                            <Grid item>
                            <Typography>
                                ilość
                            </Typography>
                            </Grid>
                        </Grid>
                        <Button startIcon={<DeleteOutlineIcon />} onClick={() => remove(shoppingCartProduct["product"].ID)}>Usuń z koszyka</Button>
                        {index < shoppingCartProducts.length - 1 && <Divider/>}
                    </Box>
                    ))
                )
            )
            }
            {!isLoading && shoppingCartProducts.length > 0 && 
                <Stack direction="row" spacing={5} sx={{marginTop: 2}}>
                    <Typography variant="h6">
                        Do zapłacenia: {getTotalPrice(shoppingCartProducts)} PLN
                    </Typography>
                    <Button
                    variant="contained"
                    endIcon={<PaymentIcon/>}
                    onClick={() => buyShoppingCartProducts()}
                    >
                        Zapłać
                    </Button>
                </Stack>
            }
        </Container>
    );
}

export default ShoppingCart;