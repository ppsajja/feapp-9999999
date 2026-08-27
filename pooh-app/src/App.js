import React from 'react';
import './App.css';
import ProfileCard from './components/ProfileCard';

const members = [
  { id: 1, name: 'อลิส ใจดี', nickname: 'ฝน',
    major: 'เทคโนโลยีสารสนเทศ', favorites: ['ชาเขียว', 'แมว'] },  
  { id: 2, name: 'อดัม นำโชค', nickname: 'เต้ย',
    major: 'เทคโนโลยีสารสนเทศ', favorites: ['pingpong', 'แมว'] },
  { id: 3, name: 'สมิท ใจจริง', nickname: 'มายด์',
    major: 'เทคโนโลยีสารสนเทศ', favorites: ['ชาเขียว', 'ฟุตบอล'] },
  // 👉 เพิ่มสมาชิกคนอื่น ๆ ของกลุ่มที่นี่ 
];

function App() {
  return (
    <div className="container">
      <h1>สมาชิกกลุ่มของเรา</h1>
      <div className="card-row">
        {members.map((m) => (
          <ProfileCard
            key={m.id}
            name={m.name}
            nickname={m.nickname}
            major={m.major}
            favorites={m.favorites}
          />
        ))}
      </div>
    </div>
  );
}

export default App;