const fs = require('fs');

let cssContent = fs.readFileSync('src/components/BottomNav/BottomNav.module.css', 'utf8');

const newStyles = `

.fabWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  position: relative;
  top: -15px;
  min-width: 64px;
}

.fabBtn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #14532D;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  box-shadow: 0 8px 20px rgba(20, 83, 45, 0.3);
  border: 4px solid #F8FAFC;
  margin-bottom: 4px;
}

.fabIcon {
  color: #FFFFFF;
}
`;

fs.writeFileSync('src/components/BottomNav/BottomNav.module.css', cssContent + newStyles);
console.log('Successfully updated BottomNav.module.css');
