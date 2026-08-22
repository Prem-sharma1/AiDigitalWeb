const fs = require('fs');

const gridPath = 'd:/AiDigitals_Projects/AiDigitalWeb/app/components/CreativeGrid.jsx';
const jsonPath = 'd:/AiDigitals_Projects/AiDigitalWeb/data/portfolioData.json';

// Update CreativeGrid.jsx
let gridData = fs.readFileSync(gridPath, 'utf8');
const searchString = '{ src: "/creative_content/Education5creative.jpeg", title: "KodeWitz Remote Internship", description: "100% remote IT internship programs with expert mentorship and live projects.", globalIndex: 14, type: "image" },';
const insertString1 = '{ src: "/creative_content/Educational8.jpeg", title: "Ayush Vikas Foundation Admissions", description: "Admission open campaign for BNYS and BPT degrees with direct and online admission options.", globalIndex: 111, type: "image" },';
const insertString2 = '{ src: "/creative_content/Educational9.jpeg", title: "Maruti Finance Educational Loan", description: "Independence Day promotional creative for education loans with zero processing fees and up to 90% funding.", globalIndex: 112, type: "image" },';

gridData = gridData.replace(searchString, `${searchString}\n      ${insertString1}\n      ${insertString2}`);
fs.writeFileSync(gridPath, gridData);

// Update portfolioData.json
let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (let group of jsonData.creativeGroups) {
  if (group.industry === 'Education') {
    // Find index of Education5creative.jpeg
    const index = group.images.findIndex(img => img.src === '/creative_content/Education5creative.jpeg');
    if (index !== -1) {
      group.images.splice(index + 1, 0, 
        {
          src: "/creative_content/Educational8.jpeg",
          title: "Ayush Vikas Foundation Admissions",
          description: "Admission open campaign for BNYS and BPT degrees with direct and online admission options.",
          globalIndex: 111,
          type: "image"
        },
        {
          src: "/creative_content/Educational9.jpeg",
          title: "Maruti Finance Educational Loan",
          description: "Independence Day promotional creative for education loans with zero processing fees and up to 90% funding.",
          globalIndex: 112,
          type: "image"
        }
      );
    }
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
console.log('Update successful');
