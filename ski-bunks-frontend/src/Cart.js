import React, { useState } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

export default function Cart() {

    const [cartCount, setCartCount] = useState(3);

  return (
    <div>
        <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
        </Badge>
    </div>
  )
}
