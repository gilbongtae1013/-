import { useEffect, useState } from 'react';

export default function Admin() {
    const [todaySagam, setTodaySagam] = useState('아직 모름');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/sagam')
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((sagam) => setTodaySagam(sagam.name))
            .catch(() => setMessage('오늘의 사감 정보를 불러오지 못했습니다.'));
    }, []);

    const changeSagam = async (name) => {
        setMessage('');
        const token = localStorage.getItem('mteworld_token');
        const response = await fetch('/api/sagam', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
            },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            setMessage('오늘의 사감 정보를 변경하지 못했습니다.');
            return;
        }
        const sagam = await response.json();
        setTodaySagam(sagam.name);
        setMessage('저장되었습니다.');
    };

    return (
        <div id='Admin-container'>
            <div id='Admin-sagamSetting'>
                <span>오늘의 사감쌤 설정: {todaySagam}</span>
                <div id='Admin-sagamButtonSet'>
                    <button onClick={() => changeSagam('창수쌤')}>창수쌤</button>
                    <button onClick={() => changeSagam('건웅쌤')}>건웅쌤</button>
                    <button onClick={() => changeSagam('아직 모름')}>아직 모름</button>
                </div>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}