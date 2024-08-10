'use client'
import Image from "next/image"
import { useState, useEffect} from 'react'
import { firestore } from "@/firebase"
import { Box, Modal, Typography, Stack, TextField, Button, Grid } from '@mui/material'
import { collection, query, doc, getDoc, setDoc, getDocs, deleteDoc } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [itemName, setItemName] = useState("")
  const [itemCount, setItemCount] = useState(0)
  const [currentItem, setCurrentItem] = useState({ name: '', quantity: 0 });
  const [filter, setFilter] = useState("")

  //async because if it is not async, it blocks our code while fetching
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }


  const addItem = async (item, count) => {
    if(count <=0){
      return
    }
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)
    count = parseInt(count, 10);

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      console.log(quantity)
      await setDoc(docRef, {quantity: quantity + count})
    } else {
      await setDoc(docRef, {quantity: count})
    }

    await updateInventory()
  }
  //runs code when something in dependency array changes. If nothing there, it only runs once when page loads
  useEffect(() => {
    updateInventory()
  }, [])


  const removeItem = async (item) => {
    console.log("removing" + item)
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity <= 1){
        await deleteDoc(docRef)
      }else {
        await setDoc(docRef, {quantity: quantity-1})
      }
    }

    await updateInventory()
  }
  
  const editItem = async (item, newName, newCount) => {
    console.log("EDITing: ", "item: ",item, " new: ", newName, newCount)

    newCount = parseInt(newCount, 10);
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnap = await getDoc(docRef)

    if(newCount <= 0){
      await deleteDoc(docRef)
      await updateInventory()
      return
    }

    if (docSnap.exists()){;
      if (item.toLowerCase() !== newName.toLowerCase()) {
        const newDocRef = doc(collection(firestore, 'inventory'), newName.toLowerCase());
          await setDoc(newDocRef, {
          quantity: newCount
        });
          await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: newCount });
      }

      await updateInventory();
    }
  }
  //runs code when something in dependency array changes. If nothing there, it only runs once when page loads
  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOpen2 = (item) => {
    setOpen2(true);
    setCurrentItem(item);
    setItemName(item.name)
  }
  const handleClose2 = () => setOpen2(false)

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose = {handleClose}>
        <Box position="absolute" 
            top="50%" 
            left="50%" 
            width={400} 
            bgcolor="white" 
            border="2px solid black" 
            boxShadow={24} 
            p={4} 
            display="flex" 
            flexDirection="column" 
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
            }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant="outlined"
              placeholder="Item Name"
              fullWidth
              value={itemName}
              onChange={(e)=> {
                setItemName(e.target.value)
              }}
            />
            <TextField
              variant="outlined"
              type="number"
              fullWidth
              value={itemCount}
              onChange={(e)=> {
                setItemCount(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, itemCount)
                setItemName("")
                setItemCount(0)
                handleClose()
              }}
            >ADD</Button>
          </Stack>
        </Box>
      </Modal>
      <Modal open={open2} onClose={handleClose2}>
        <Box position="absolute" 
          top="50%" 
          left="50%" 
          width={400} 
          bgcolor="white" 
          border="2px solid black" 
          boxShadow={24} 
          p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography>
          </Typography>
          <Typography variant="h6">Editing {currentItem.name}</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant="outlined"
              placeholder="Item Name"
              fullWidth
              value={itemName}
              onChange={(e)=> {
                setItemName(e.target.value)
              }}
            />
            <TextField
              variant="outlined"
              type="number"
              fullWidth
              value={itemCount}
              onChange={(e)=> {
                setItemCount(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                editItem(currentItem.name, itemName, itemCount)
                setItemName("")
                setItemCount(0)
                handleClose2()
                setCurrentItem({ name: '', quantity: 0 })
              }}
            >CONFIRM</Button>
          </Stack>
        </Box>
      </Modal>
        <Box border='1px solid #333'>
          <Box
            width="1000px"
            height="100px"
            bgcolor="#ADD8E6"
            sx={{
              paddingTop: "10px",
            }}
          >
            <Typography 
              variant="h2"
              color="#333"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >Inventory Items</Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" marginRight={8}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5" marginRight="10px" marginLeft="35px">Search</Typography>
              <TextField
                variant="outlined"
                sx={{ height: '40px', '.MuiOutlinedInput-root': { height: '100%' }, margin:"10px" }}
                value={filter}
                onChange={(e)=> {
                  setFilter(e.target.value)
                }}
              />
            </Box>
            <Button
              variant="contained"
              size="large"
              sx={{
                fontSize: '16px', 
                backgroundColor: 'green',
              }}
              onClick={()=>{
                handleOpen()
              }}
            >Add New Item</Button>
          </Box>
            <Stack
              width="1000px"
              height="600px"
              spacing={2}
              overflow="auto"
            >
              {
                inventory.filter(({ name, quantity }) => {
                  return name.includes(filter);
                }).map(({name, quantity}) => (
                  <Box
                    key={name}
                    width="100%"
                    height="80px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    bgcolor="#f0f0f0"
                    padding={5}
                  >
                    <Grid container alignItems="center">
                      <Grid item xs={7}>
                        <Typography
                          variant="h5"
                          color="#333"
                          textAlign="left"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                      </Grid>

                      <Grid item xs={1}>
                        <Typography variant="h5" color="#333" textAlign="center">
                          {quantity}
                        </Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button variant="contained" onClick={() => addItem(name, 1)}>
                            +
                          </Button>
                          <Button variant="contained" onClick={() => removeItem(name)}>
                            -
                          </Button>
                          <Button variant="contained" onClick={() => handleOpen2({ name: name, quantity: quantity })}>
                            Edit
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                ))
              }
            </Stack>
      </Box>
    </Box>
  )
}
