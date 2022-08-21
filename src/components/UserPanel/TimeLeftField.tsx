import React, { useContext } from "react";
import DisplayContext from "../../context/DisplayContext";



export default function TimeLeftField() {
  const displayContext = useContext(DisplayContext);
  const { userDetails } = displayContext;


  function extractTime(part: any) {
    if (userDetails["daysLeft"] === undefined)
      return "";

    let daysLeft = userDetails["daysLeft"];
    if (part === "d")
      return Math.floor(daysLeft);
    if (part === "h")
      return Math.floor((daysLeft - Math.floor(daysLeft)) * 24);
    if (part === "m")
      return Math.floor((daysLeft - Math.floor(daysLeft) - Math.floor(daysLeft - Math.floor(daysLeft))) * 60);
    return undefined;
  }

  function getPlural(paran:any){
    let num: any = extractTime(paran)
    if (num> 1 ){
      return "s"
    }
  }
  return (
    <>
      <div className="time-left-label">
        <div>
          Tempo Restante
        </div>
        <div className="time">
                {extractTime("d")} dia{getPlural(("d") )}  {extractTime("h")}   houra{getPlural(("h"))}  {extractTime("m")} minuto{getPlural(("m"))}
         </div>
      </div>
      <hr />
    </>
  )
}