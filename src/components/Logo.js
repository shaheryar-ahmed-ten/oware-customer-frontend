import noImageFound from "../assets/logo/oware-logo-black.png";
import axios from "axios";
import { getURL } from "../utils/common";
import { useEffect, useState } from "react";

export default function Logo({ variant }) {
  // const [filelocation, setFileLocation] = useState(null);
  const [Logo, setLogo] = useState("");
  useEffect(() => {
    getRelations();
  }, []);

  const getRelations = (e) => {
    // e.preventDefault();
    axios.get(getURL("user/company")).then((res) => {
      // res.data.file && res.data.file.id ? setFileLocation(res.data.file.id): setFileLocation('');
      res.data.file && res.data.file.id ? setLogo(getURL("preview", res.data.file.id)) : setLogo(noImageFound);
    });
  };
  // const Logo = filelocation && getURL('preview',filelocation) ? getURL('preview',filelocation) : noImageFound;
  return (
    <a href="/dashboard">
      <img src={Logo} alt="" height="40px" width="150px" />
    </a>
  );
}
