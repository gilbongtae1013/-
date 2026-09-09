import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mypage({ user, setUser }) {
    const [name, setName] = useState(user?.name || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || null);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            setMessage('프로필 이미지는 3MB 이하로 선택해주세요.');
            event.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setProfileImage(reader.result);
            setMessage('');
        };
        reader.readAsDataURL(file);
    };

    const saveProfile = async () => {
        if (!name.trim()) {
            setMessage('닉네임을 입력해주세요.');
            return;
        }
        setIsSaving(true);
        setMessage('');
        try {
            const response = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('mteworld_token') || ''}`,
                },
                body: JSON.stringify({ name, profileImage }),
            });
            const result = await response.json();
            if (!response.ok) {
                setMessage(result.message || '프로필 수정에 실패했습니다.');
                return;
            }
            setUser(result);
            setName(result.name);
            setProfileImage(result.profileImage);
            setMessage('프로필이 수정되었습니다.');
        } catch {
            setMessage('서버에 연결할 수 없습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div id='Mypage-container'>
            <div id='Mypage-box'>
                <h1 id='Mypage-title'>마이페이지</h1>
                <div id='Mypage-profileImage' style={profileImage ? { backgroundImage: `url(${profileImage})` } : undefined}></div>
                <label id='Mypage-imageLabel' htmlFor='Mypage-imageInput'>프로필 이미지 변경</label>
                <input id='Mypage-imageInput' type='file' accept='image/*' onChange={handleImageChange} />

                <label htmlFor='Mypage-studentId'>학번</label>
                <input id='Mypage-studentId' value={user?.studentId || ''} readOnly />
                <label htmlFor='Mypage-name'>닉네임</label>
                <input id='Mypage-name' value={name} onChange={(event) => setName(event.target.value)} />
                <button id='Mypage-saveButton' type='button' onClick={saveProfile} disabled={isSaving}>
                    {isSaving ? '저장 중...' : '저장'}
                </button>
                {message && <p id='Mypage-message'>{message}</p>}
                <button id='Mypage-backButton' type='button' onClick={() => navigate('/')}>돌아가기</button>
            </div>
        </div>
    );
}