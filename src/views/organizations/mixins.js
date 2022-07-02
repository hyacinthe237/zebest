import pdfFileIcon from '@/assets/images/icon-pdf.png'
import pptxFileIcon from '@/assets/images/icon-pptx.png'
import htmlFileIcon from '@/assets/images/icon-html.png'
import pngFileIcon from '@/assets/images/icon-png.png'
import docxFileIcon from '@/assets/images/icon-docx.png'
import folderIcon from '@/assets/images/icon-folder.png'
import jpegFileIcon from '@/assets/images/icon-jpeg.png'
import xlsxFileIcon from '@/assets/images/icon-xlsx.png'
import zipFileIcon from '@/assets/images/icon-zip.png'
import excelFileIcon from '@/assets/images/icon-excel.png'



export default {

    computed: {
        pdf () { return pdfFileIcon },
        pptx () { return pptxFileIcon },
        html () { return htmlFileIcon },
        png () { return pngFileIcon },
        jpeg () { return jpegFileIcon },
        docx () { return docxFileIcon },
        xlsx () { return xlsxFileIcon },
        zip () { return zipFileIcon },
        excel () { return excelFileIcon },
        folder_icon () { return folderIcon },
    },

}
