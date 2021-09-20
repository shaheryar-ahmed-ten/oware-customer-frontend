import owareLogo from '../assets/logo/owareLogo.png'
import noImageFound from '../assets/logo/noImageFound.png'
import axios from 'axios';
import { getURL } from '../utils/common';
import { useEffect, useState } from 'react';

export default function Logo({ variant }) {
  
  const [filelocation, setFileLocation] = useState(null);
  useEffect(() => {
    getRelations();
}, []);

  const getRelations = e => {
    // e.preventDefault();
    axios.get(getURL('user/company'))
    .then((res) => {
      
      // console.log(res.data);
      res.data.file && res.data.file.id ? setFileLocation(res.data.file.id): setFileLocation('');

      // console.log(getURL('/preview',filelocation))
  })
  }
  const Logo = filelocation && getURL('preview',filelocation) ? getURL('preview',filelocation) : noImageFound;
  console.log("Logo",Logo)
  return (
    <a href = "dashboard" ><img src={Logo} alt="oware logo" /></a>
  );
};
