// Define the type for section details
interface SectionDetails {
    [key: string]: {
      hadithnumber_first: number;
      hadithnumber_last: number;
      arabicnumber_first: number;
      arabicnumber_last: number;
    };
  }
  
  // Define the type for the reference object inside each hadith
  interface HadithReference {
    book: number;
    hadith: number;
  }
  
  // Define the type for each individual hadith
  interface Hadith {
    hadithnumber: number;
    arabicnumber: number;
    text: string;
    grades: string[];  // This is an array of strings, assuming it may hold any grades related to the hadith
    reference: HadithReference;
  }
  
  // Define the type for metadata
  interface Metadata {
    name: string;
    sections: { [key: string]: string };
    section_details: SectionDetails;
  }
  
  // Define the overall structure for the JSON file
  interface HadithData {
    
    metadata: Metadata;
    hadiths: Hadith[];
  }

  




  // prayer table

