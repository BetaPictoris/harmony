import React from "react";
import Button from "../Button";

export default function LibraryScan(props) {
  const [checkScanning, setCheckScanning] = React.useState(false); // If true check `isScanning` every 1 second
  const [isScanning, setIsScanning] = React.useState(false); // If true library is currently being scanned
  const [doneScanning, setDoneScanning] = React.useState(false); // If true library has finished scanning

  // Scan library
  function scanLibrary() {
    fetch("/api/v1/index/update");
    setCheckScanning(true);
  }

  // Check `isScanning` every 1 second
  React.useEffect(() => {
    setTimeout(() => {
      if (checkScanning) {
        fetch("/api/v1/index/status").then((response) => {
          setIsScanning(response === "true");
        });

        if (!isScanning) {
          setCheckScanning(false);
          setDoneScanning(true);
        }

        console.log(isScanning);
      }
    }, 1000);
  }, [checkScanning]);

  // Render
  return (
    <div className="libraryScan">
      <h3 className="libraryScanTitle settingsOptionTitle">Library Scan</h3>
      <Button onClick={scanLibrary}>
        {isScanning ? "Scanning..." : "Scan Library"}
      </Button>
      <p className="libraryScanOptions settingsOptionOptions">
        {isScanning
          ? "The library is currently being scanned."
          : "Scan the library for new or updated files."}
        {doneScanning && " The library has finished scanning."}
      </p>
    </div>
  );
}
