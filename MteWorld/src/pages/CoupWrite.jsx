

export default function CoupWrite() {

    return (
        <div className='Cwrite-container'>
            <div className='Cwrite-top'>
                <input placeholder="제목을 입력하시오"/>
                <input placeholder="장소를 입력하시오"/>
                <input placeholder="날짜를 입력하시오" type="date"/>
            </div>

            <textarea className="Cwrite-content"></textarea>
        </div>
    )
}