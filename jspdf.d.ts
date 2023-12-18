// // jspdf.d.ts
// declare module "jspdf" {
//   interface JsPDF {
//     autoTable: any; // Add a generic type or a more specific type if available
//   }

//   const jsPDF: {
//     new (): JsPDF;
//     // Add any other properties or methods you intend to use
//   };

//   export default jsPDF;
// }

// types/jspdf.d.ts

// types/jspdf.d.ts

import { jsPDF, jsPDFAPI } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface AutoTable {
    (options?: any): any;
  }
  export interface ExtendedJsPDF extends jsPDFAPI {
    autoTable: any; // Replace 'any' with a more specific type if available
  }

  interface ExtendedJsPDF extends jsPDF {
    autoTable: AutoTable;
  }

  const jsPDFWithAutoTable: {
    new (): ExtendedJsPDF;
  };

  export default jsPDFWithAutoTable;
}
