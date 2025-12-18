import React from "react";


const LeftSection: React.FC = () => {
  return (
    <>
    <div className="hidden lg:block w-2/5 relative overflow-hidden text-gray-100">
      <div className="absolute  top-0 left-0 bottom-0 z-10  w-full h-screen  ">
       <img className="object-cover h-screen w-screen opacity-90" src="./login.png" alt="" />

      </div>
      {/* <div className="absolute top-2 left-1.5 z-30 ">
        <img src="./logo.png"  className = "w-48 bg-transparent "alt="" />
      </div> */}
      <div className="absolute top-1 -left-7 z-30 ">
  <img 
    src="./logo2.png" 
    className="w-2xs drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
    alt="" 
  />
</div>
      {/* <div className="absolute  inset-0 bg-linear-to-br from-gray-800 to-gray-900 " /> */}

{/* 
       <div className="absolute top-0 right-0 h-full z-20  w-35 
 bg-gray-900/70 rounded-l-[120%]" />  */}

    </div>
    </>

  );
};

export default LeftSection;
