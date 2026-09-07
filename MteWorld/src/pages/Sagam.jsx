import { useEffect, useState } from 'react';


export default function Sagam() {

    const [todaySagam, setTodaySagam] = useState("아직 모름");
    const [isClick, setIsClick] = useState(false); //클릭되면 Box에 css 추가
    const [showSagam, setShowSagam] = useState(false); //클릭되면 사감쌤 글자 표시

    useEffect(() => {
        fetch('/api/sagam')
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((sagam) => setTodaySagam(sagam.name))
            .catch(() => setTodaySagam('아직 모름'));
    }, []);

    const BoxClick = () => {
        setShowSagam(true);
        setIsClick(true);
    }

    return (
        <div id="Sagam-container">
            <h1 id='Sagam-title'>오늘의 사감쌤은?</h1>

            <div id='Sagam-box'>
                {showSagam ? todaySagam : ""}
                <div id='Sagam-boxCover' className={isClick ? "active" : ""} onClick={BoxClick}>클릭해서 확인</div>
            </div>
        </div>
    )
}