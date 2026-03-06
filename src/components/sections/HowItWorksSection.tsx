const STEPS = [
  { num: '01', title: '요청서 작성', desc: '원하는 분야, 지역, 예산을\n간단히 입력합니다' },
  { num: '02', title: '강사 매칭', desc: '조건에 맞는 강사를\n담당자가 연결해드립니다' },
  { num: '03', title: '상담 & 확정', desc: '강사와 일정·수강료를\n협의하고 확정합니다' },
  { num: '04', title: '레슨 시작', desc: '전문 강사와 함께\n실력을 키워나갑니다' },
]

export default function HowItWorksSection() {
  return (
    <section className="section-pad" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <h2 className="process-title">
            매칭 프로세스
          </h2>
          <p className="process-subtitle">
            신청부터 레슨까지 4단계로 간단하게
          </p>
        </div>

        <div className="process-grid">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                padding: '50px 30px',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              {/* 연결선 */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: '-1px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2px',
                  height: '40px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  zIndex: 1,
                }} />
              )}

              <div
                style={{
                  fontFamily: 'var(--font-eng-bold)',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.2)',
                  lineHeight: 1,
                  marginBottom: '20px',
                }}
              >
                {step.num}
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '15px', opacity: 0.75, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <a href="/match" className="btn-outline-white">
            지금 매칭 신청하기
          </a>
        </div>
      </div>
    </section>
  )
}
