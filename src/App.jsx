import React, { useState, useEffect } from 'react';
import { Moon, Sun, Sunrise, Sparkles, Star, ChevronRight, RefreshCw, Heart, Coins, Briefcase, User, CheckCircle2, AlertTriangle, TrendingUp, Calendar, Shield, Zap, BookOpen, Compass, Clock, Activity, Target, Download, Image as ImageIcon, Users, PieChart, Flame, MessageCircle, MessageSquare, Palette, Hash, Coffee, ThumbsUp, ThumbsDown, UserCheck, UserX, Info, Baby, ArrowUpRight, ArrowDownRight, MapPin, Home, UserCircle, Plus, Trash2, MoonStar, Edit2 } from 'lucide-react';

// --- [데이터 정의] 오행 컬러 및 한자 데이터 ---
const ELEMENTS = {
  wood: { color: 'text-emerald-400', bg: 'bg-emerald-950', border: 'border-emerald-800/50', name: '나무(木)' },
  fire: { color: 'text-rose-400', bg: 'bg-rose-950', border: 'border-rose-800/50', name: '불(火)' },
  earth: { color: 'text-amber-400', bg: 'bg-amber-950', border: 'border-amber-800/50', name: '흙(土)' },
  metal: { color: 'text-slate-300', bg: 'bg-slate-800', border: 'border-slate-600/50', name: '쇠(金)' },
  water: { color: 'text-blue-400', bg: 'bg-blue-950', border: 'border-blue-800/50', name: '물(水)' },
};

const CHEONGAN = [
  { char: '甲', kor: '갑', element: 'wood' }, { char: '乙', kor: '을', element: 'wood' },
  { char: '丙', kor: '병', element: 'fire' }, { char: '丁', kor: '정', element: 'fire' },
  { char: '戊', kor: '무', element: 'earth' }, { char: '己', kor: '기', element: 'earth' },
  { char: '庚', kor: '경', element: 'metal' }, { char: '辛', kor: '신', element: 'metal' },
  { char: '壬', kor: '임', element: 'water' }, { char: '癸', kor: '계', element: 'water' }
];

const JIJI = [
  { char: '子', kor: '자', element: 'water', animal: '쥐' }, { char: '丑', kor: '축', element: 'earth', animal: '소' },
  { char: '寅', kor: '인', element: 'wood', animal: '호랑이' }, { char: '卯', kor: '묘', element: 'wood', animal: '토끼' },
  { char: '辰', kor: '진', element: 'earth', animal: '용' }, { char: '巳', kor: '사', element: 'fire', animal: '뱀' },
  { char: '午', kor: '오', element: 'fire', animal: '말' }, { char: '未', kor: '미', element: 'earth', animal: '양' },
  { char: '申', kor: '신', element: 'metal', animal: '원숭이' }, { char: '酉', kor: '유', element: 'metal', animal: '닭' },
  { char: '戌', kor: '술', element: 'earth', animal: '개' }, { char: '亥', kor: '해', element: 'water', animal: '돼지' }
];

const SINSAL_DATA = {
  도화: {
    name: '도화살(桃花殺)', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30',
    keyword: '매력과 사교성',
    desc: { mild: "사람을 끌어당기는 특유의 매력과 스타성이 있습니다. 대인관계에서 호감을 쉽게 얻으며 방송, 예술, 영업 분야에 유리합니다.", spicy: "가만히 있어도 피곤한 일에 엮이거나 쓸데없이 이성 문제를 일으킵니다. 매력인 줄 착각하고 오지랖 부리다간 구설수 폭탄 맞습니다." }
  },
  역마: {
    name: '역마살(驛馬殺)', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30',
    keyword: '이동과 활동성',
    desc: { mild: "한곳에 머무르기보다 돌아다니고 경험하며 에너지를 얻습니다. 활동 반경이 넓어 해외운이나 유통, 영업, 출장이 잦은 직무와 찰떡입니다.", spicy: "엉덩이가 가벼워서 한 가지 일을 진득하게 못 합니다. 뭐 하나 끝맺음 없이 여기저기 들쑤시고 다니는 전형적인 산만한 팔자입니다." }
  },
  화개: {
    name: '화개살(華蓋殺)', icon: MoonStar, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30',
    keyword: '예술과 고독',
    desc: { mild: "감수성이 풍부하고 생각의 깊이가 남다릅니다. 화려함을 덮고 내면을 탐구하는 기운이라 종교, 철학, 학문, 예술 분야에서 대성합니다.", spicy: "허구한 날 방구석에 틀어박혀 쓰잘데기 없는 망상이나 하는 현실 도피자입니다. 우울한 분위기 풍기며 주변 사람 기운까지 다 빼놓습니다." }
  },
  백호: {
    name: '백호대살(白虎大殺)', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30',
    keyword: '폭발적 에너지',
    desc: { mild: "평소에는 얌전해도 위기 상황에서 엄청난 폭발력을 보여주는 카리스마가 있습니다. 끈기와 돌파력이 강해 전문직에서 큰 두각을 나타냅니다.", spicy: "분노 조절 장애 수준으로 한번 욱하면 앞뒤 안 가리고 폭주합니다. 그 더러운 성질 머리 못 고치면 주변 사람 다 떠나고 고립됩니다." }
  },
  괴강: {
    name: '괴강살(魁罡殺)', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30',
    keyword: '우두머리의 기질',
    desc: { mild: "타인의 지배를 받기 싫어하는 강한 리더십과 총명함이 있습니다. 결단력이 좋고 통솔력이 뛰어나 조직의 수장이나 사업가에 적합합니다.", spicy: "남 밑에서 절대 고개 못 숙이는 뻣뻣한 오만의 끝판왕입니다. 지 잘난 맛에 살면서 주변 사람 통제하려 들다간 크게 한 방 먹습니다." }
  }
};

// --- [동적 텍스트 풀(Pool) : 순한맛 & 매운맛 적용] ---
const ELEMENT_TRAITS = {
  wood: { 
    keyword: "성장과 기획", 
    desc: { mild: "시작하는 에너지가 강하며 기획력이 뛰어나고 위로 뻗어나가려는 긍정적인 성향이 있습니다.", spicy: "일단 생각없이 저지르고 보는 추진력은 최고지만, 뒤수습은 늘 주변 사람의 몫으로 남기는 피곤한 스타일입니다." }, 
    strength: "방향이 맞다고 판단되면 바로 움직이는 강한 추진력", 
    weakness: { mild: "시작은 좋으나 마무리가 약할 수 있으며 싫증을 빨리 느낌", spicy: "일만 잔뜩 벌리고 마무리는 절대 못 하는 극강의 용두사미. 심각한 변덕쟁이." } 
  },
  fire: { 
    keyword: "열정과 명예", 
    desc: { mild: "감정이 풍부하고 리더십이 돋보이며, 자신을 표현하고 평가받는 것을 중요하게 생각합니다.", spicy: "자기가 세상의 중심이어야 직성이 풀리는 관종끼가 다분하며, 감정 기복으로 주변 분위기를 자주 망칩니다." }, 
    strength: "뛰어난 언변과 사람을 끌어당기는 매력, 책임감", 
    weakness: { mild: "성격이 급할 수 있고 감정의 기복이 겉으로 잘 드러남", spicy: "욱하는 성질을 못 죽여서 다 된 밥에 재를 자주 빠뜨림. 남의 말 절대 안 듣는 독불장군." } 
  },
  earth: { 
    keyword: "신뢰와 포용", 
    desc: { mild: "중재자 역할을 잘하며 흔들림 없이 묵묵히 결과를 만들어내는 든든함이 있습니다.", spicy: "본인만의 꽉 막힌 철학에 갇혀 남의 말은 귓등으로도 안 듣는 고구마 100개 먹은 답답함의 상징입니다." }, 
    strength: "어떤 상황에서도 중심을 잃지 않는 포용력과 현실 감각", 
    weakness: { mild: "변화에 적응하는 속도가 느리고 고집이 강할 수 있음", spicy: "아집이 너무 강해 변화를 두려워하는 우물 안 개구리. 고집불통 그 자체." } 
  },
  metal: { 
    keyword: "결단과 원칙", 
    desc: { mild: "판단이 빠르고 옳고 그름의 기준이 분명하여 실무적이고 냉철한 이미지를 줍니다.", spicy: "공감 능력은 바닥이면서 팩트 폭력이랍시고 함부로 입을 놀려 주변 사람 가슴에 피멍을 들게 합니다." }, 
    strength: "사람이나 일을 볼 때 우왕좌왕하지 않는 명확한 기준", 
    weakness: { mild: "타인이 느리거나 비효율적이면 답답함을 느끼고 말이 날카로움", spicy: "자기 기준만 정답인 줄 아는 꼰대 기질. 날카로운 말투 때문에 곁에 사람이 안 남음." } 
  },
  water: { 
    keyword: "지혜와 유연성", 
    desc: { mild: "상황 적응력이 뛰어나고 속을 깊이 알 수 없는 지혜로움과 유연함을 가졌습니다.", spicy: "머릿속으로만 시뮬레이션을 수백 번 돌리고 막상 실천은 1도 안 하는 게으른 완벽주의자입니다." }, 
    strength: "탁월한 아이디어와 깊은 통찰력, 친화력", 
    weakness: { mild: "생각이 너무 많아 실행이 늦어지거나 우울감에 쉽게 빠질 수 있음", spicy: "혼자만의 끝없는 우울감에 빠져 징징대며 주변 사람의 에너지까지 쪽쪽 빨아먹음." } 
  }
};

const ELEMENT_ANALYSIS = {
  wood: { 
    excess: { mild: "나무가 너무 빽빽하면 숲이 자라기 어렵듯, 시작하는 일만 많고 마무리가 안 될 수 있습니다. 꺾이지 않는 고집을 주의하세요.", spicy: "쓸데없는 오지랖과 아집으로 남의 일에 참견만 하다가 정작 자기 밥그릇은 다 엎어버리는 꼴입니다. 고집 좀 꺾으세요." }, 
    lack: { mild: "새로운 환경에 뛰어들거나 모험을 시작하는 데 두려움이 있을 수 있습니다. 작은 목표부터 세우고 행동으로 옮기는 연습이 필수입니다.", spicy: "실패가 두려워 아무것도 시도조차 못 하는 겁쟁이입니다. 머리 굴리는 소리 좀 그만 내고 일단 제발 몸부터 움직이세요." } 
  },
  fire: { 
    excess: { mild: "불길이 거세어 감정 기복이 심하고 성격이 급해질 수 있습니다. 욱하는 마음을 다스리고 차분하게 뒤를 돌아보는 여유가 필요합니다.", spicy: "감정 조절 장애 수준으로 감정이 널뜁니다. 그 더러운 성질 머리 못 고치면 나이 들어서 주변에 아무도 안 남고 외롭게 늙습니다." }, 
    lack: { mild: "남들 앞에 나서서 나를 어필하는 열정이나 표현력이 부족할 수 있습니다. 억지로라도 활기찬 에너지를 끌어올리려는 노력이 필요합니다.", spicy: "물에 물 탄 듯 무기력함의 극치입니다. 눈치만 보며 묻어가려 하지 말고 당신의 목소리 좀 똑바로 내세요." } 
  },
  earth: { 
    excess: { mild: "흙이 너무 많으면 산이 가로막힌 격입니다. 변화를 극도로 싫어하고 나만의 고집에 갇힐 수 있으니 유연한 사고방식을 길러야 합니다.", spicy: "태산에 갇혀버린 꼴입니다. 타인의 조언은 개나 줘버리고 자기 세상에 빠져 발전이 1도 없습니다. 그놈의 똥고집 당장 버리세요." }, 
    lack: { mild: "뿌리를 내릴 땅이 부족하여 한곳에 정착하지 못하고 마음이 붕 뜰 수 있습니다. 나만의 확고한 신념과 심리적 안정감을 찾는 것이 중요합니다.", spicy: "끈기라곤 바닥을 쳐서 조금만 힘들면 철새처럼 도망가기 바쁩니다. 한 우물도 제대로 못 파는 그 습관부터 당장 고치세요." } 
  },
  metal: { 
    excess: { mild: "쇠가 너무 많으면 성격이 날카롭고 맺고 끊음이 지나쳐 주변 사람들이 상처를 받을 수 있습니다. 부드러운 포용력을 의식적으로 연습하세요.", spicy: "숨 막히는 강박증 환자. 내 방식만 맞다며 주변을 칼질하고 비난하니 사람들이 전부 등 돌리고 떠나는 겁니다." }, 
    lack: { mild: "단호하게 결단을 내리거나 원칙을 밀어붙이는 힘이 약할 수 있습니다. 정에 이끌려 손해를 보지 않도록 객관적인 기준을 세우세요.", spicy: "우유부단함의 끝판왕. 정에 휩쓸려 호구 잡히고 남 좋은 일만 하다가 뒤통수 맞기 딱 좋은 답답한 사주입니다." } 
  },
  water: { 
    excess: { mild: "물이 너무 깊으면 속을 알 수 없고 우울감이나 잡생각에 쉽게 빠질 수 있습니다. 생각만 하지 말고 밝은 곳으로 나와 몸을 움직여야 합니다.", spicy: "끝도 없는 우울의 늪에 빠져 허우적댑니다. 생각만 잔뜩 하고 실천은 절대 안 하는 심각한 게으름뱅이. 이불 밖으로 당장 나오세요." }, 
    lack: { mild: "융통성이 부족하고 상황에 유연하게 대처하는 능력이 떨어질 수 있습니다. 고정관념을 버리고 물 흐르듯 유연하게 받아들이는 연습을 하세요.", spicy: "꽉 막힌 벽창호입니다. 상황이 바뀌면 맞춰가야 하는데 뻣뻣하게 굴다가 혼자서만 매번 억울하게 손해를 봅니다." } 
  }
};

const LUCKY_SOLUTIONS = {
  wood: { color: "초록색, 민트색 계열", item: "화분, 나무 소재의 소품", space: "공원, 숲, 식물이 많은 카페", person: "활동적이고 나에게 새로운 동기를 부여해 주는 사람", direction: "동쪽 (East)" },
  fire: { color: "붉은색, 분홍색, 오렌지색", item: "조명, 캔들, 화려한 악세서리", space: "햇빛이 잘 드는 곳, 화려하고 사람 많은 번화가", person: "열정적이고 칭찬과 리액션이 풍부한 사람", direction: "남쪽 (South)" },
  earth: { color: "노란색, 베이지색, 브라운", item: "도자기, 크리스탈, 흙 소재 소품", space: "아늑하고 조용한 집안, 안정감이 느껴지는 오래된 장소", person: "신뢰할 수 있고 과묵하며 내 말을 잘 들어주는 사람", direction: "중앙 (거주지의 중심부)" },
  metal: { color: "흰색, 은색, 회색", item: "금속 시계, 메탈릭한 소품, 거울", space: "세련되고 모던한 공간, 깔끔하게 정리된 사무실", person: "공과 사가 확실하고 논리적이며 배울 점이 있는 사람", direction: "서쪽 (West)" },
  water: { color: "검은색, 네이비색, 푸른색", item: "어항, 수분크림, 유리 공예품", space: "강변, 바닷가, 잔잔한 음악이 흐르는 차분한 공간", person: "생각이 깊고 지혜로우며 나의 감수성을 이해하는 사람", direction: "북쪽 (North)" }
};

const WEALTH_TRAITS = {
  wood: { 
    overview: "초기 투자나 기획을 통해 재물을 창출하는 능력이 뛰어납니다. 꾸준히 성장하는 장기 투자에 유리합니다.", 
    good: ["교육, 기획, 아이디어 관련 수익", "성장성 높은 장기 투자 및 적립"], 
    bad: { mild: ["단기적인 단타 매매", "충동적인 지출"], spicy: ["근거 없는 자만심으로 벌이는 묻지마 투자", "귀가 너무 얇아서 지인 말만 믿고 던지는 돈"] } 
  },
  fire: { 
    overview: "이름이 널리 알려질수록, 명예가 높아질수록 재물이 따라붙는 '명예형 재물운'입니다.", 
    good: ["개인 브랜딩을 통한 수익 증가", "강연, 방송, 인센티브 기반 영업"], 
    bad: { mild: ["체면 유지를 위한 과소비", "감정에 휩쓸린 즉흥적 투자"], spicy: ["남들 시선 의식해서 긁어대는 폼생폼사 카드 빚", "감정 조절 못해 스트레스성으로 날리는 홧김 비용"] } 
  },
  earth: { 
    overview: "티끌 모아 태산을 이루는 가장 안정적이고 단단한 재물운을 가졌습니다. 자산 축적에 아주 유리합니다.", 
    good: ["부동산, 청약, 안전자산 투자", "정기적인 적금과 예금"], 
    bad: { mild: ["하이리스크 하이리턴 단기 투자", "지인과의 금전 거래나 보증"], spicy: ["가족/지인 보증 서주다 인생 같이 망하는 지름길", "변화 못 읽고 낡은 것에 집착하다 다 날아가는 투자 타이밍"] } 
  },
  metal: { 
    overview: "결단력이 뛰어나 돈의 흐름을 잘 읽고 맺고 끊음이 확실해 재물이 쉽게 새어나가지 않습니다.", 
    good: ["금융, 관리, 컨설팅 관련 수익", "확실한 계약과 수수료 기반의 수익"], 
    bad: { mild: ["과도한 원칙주의로 인한 투자 기회 상실", "의리에 이끌린 금전 대여"], spicy: ["내 생각만 무조건 맞다는 똥고집으로 기회 다 날림", "과도한 쫄보 기질로 인플레이션에 계좌 녹는 줄 모름"] } 
  },
  water: { 
    overview: "물이 흘러가듯 유연하게 돈을 벌어들이며, 정보력과 뛰어난 아이디어가 곧 돈이 되는 지식형 재물운입니다.", 
    good: ["지적 재산권, 특허, 저작권", "정보 비대칭을 활용한 전략적 투자"], 
    bad: { mild: ["생각만 하다 놓치는 투자 타이밍", "스트레스로 인한 홧김 비용"], spicy: ["정보만 잔뜩 수집해놓고 정작 무서워서 실행은 1도 못함", "얕은 잔머리 굴리다 시장한테 크게 한 대 맞고 계좌 청산"] } 
  }
};

const CAREER_TRAITS = {
  wood: { overview: "새로운 것을 기획하고 시작하는 능력이 탁월합니다. 무에서 유를 창조하는 일이나 누군가를 가르치고 기르는 일에 적합합니다.", suitable: ["기획자, 프로젝트 매니저", "교육, 출판, 육영 사업", "건축, 디자인, 인테리어", "스타트업 창업 및 IT 개발"] },
  fire: { overview: "자신을 드러내고 남들에게 영감을 주는 일에서 빛을 발합니다. 화려하고 활동적이며 결과가 즉각적으로 나타나는 직업이 좋습니다.", suitable: ["방송, 연예, 언론, 크리에이터", "마케팅, 홍보, 영업", "디자인, 뷰티, 패션", "에너지를 다루는 요식업/스포츠"] },
  earth: { overview: "사람과 사람 사이를 중재하고, 흔들림 없이 조직을 안정시키는 역할에 제격입니다. 신뢰를 바탕으로 자산을 다루는 일에 능합니다.", suitable: ["부동산, 건축, 농업", "인사, 총무, 중간 관리자", "종교, 철학, 상담사", "신뢰 기반의 자산 관리 및 중개업"] },
  metal: { overview: "맺고 끊음이 확실하고 원칙을 중시합니다. 날카로운 판단력과 분석력이 필요한 전문직이나 숫자를 다루는 일에서 크게 성공합니다.", suitable: ["금융, 회계, 세무", "경찰, 군인, 법률, 의료", "기계, 금속, 자동차 엔지니어", "냉철한 분석이 필요한 컨설팅"] },
  water: { overview: "고정된 틀에 얽매이지 않고 유연하게 사고합니다. 뛰어난 정보력과 지혜를 활용하거나, 사람이나 물자가 끊임없이 흐르는 직업이 좋습니다.", suitable: ["무역, 유통, 해운업", "연구원, 학자, 데이터 분석", "심리 상담, 예술, 작가", "해외 관련 업무 및 IT 정보통신"] }
};

const HEALTH_TRAITS = {
  wood: { 
    overview: {
      mild: "간, 담, 신경계 쪽이 예민할 수 있습니다. 잦은 피로감과 시력 저하를 평소에 조심해야 합니다.",
      spicy: "태생적으로 간과 신경계가 쓰레기 수준으로 약합니다. 만날 밤새고 스트레스받으며 버티면 내년에 당장 병원 신세 지고 뼈저리게 후회할 겁니다."
    }, 
    points: {
      mild: ["만성 피로 및 간 기능 저하", "눈의 뻑뻑함과 피로감", "근육 통증 및 목/어깨 경직", "스트레스성 신경 과민"],
      spicy: ["맨날 피곤하다고 징징대지 말고 일찍 자는 습관", "안구 건조증 올 때까지 스마트폰 보는 중독 끊기", "스트레스 핑계로 밤마다 술 마시는 최악의 습관", "운동 부족으로 쓰레기가 되어버린 근력"]
    }
  },
  fire: { 
    overview: {
      mild: "심장, 소장, 혈압 쪽을 주의해야 합니다. 열이 위로 뻗치는 화병이나 급격한 감정 변화를 다스려야 합니다.",
      spicy: "욱하는 성질 머리 못 죽이면 심장병이나 고혈압으로 쓰러지기 딱 좋은 사주입니다. 당신의 분노 조절 장애가 남은 수명을 갉아먹고 있습니다."
    }, 
    points: {
      mild: ["혈압 변동 및 심박수 증가", "얼굴이나 두피 열감 및 홍조", "수면 부족 및 불면증", "가슴 답답함"],
      spicy: ["별것도 아닌 일에 화내다 혈압 올라 쓰러지기", "밤마다 잡생각 하느라 잠 못 자는 불면증", "가슴에 화가 쌓여서 생기는 홧병과 탈모", "자극적인 음식만 쳐다보는 끔찍한 식습관"]
    }
  },
  earth: { 
    overview: {
      mild: "위, 비장 등 소화기관이 약해지기 쉬운 체질입니다. 생각이 많아지거나 스트레스를 받으면 소화가 가장 먼저 안 됩니다.",
      spicy: "조금만 스트레스 받아도 체하고 소화불량 달고 사는 유리 위장입니다. 먹는 걸로 스트레스 풀다가 고도 비만 되기 딱 좋은 위험 체질입니다."
    }, 
    points: {
      mild: ["소화 불량 및 위산 역류", "활동량 부족으로 인한 체중 증가", "피부 트러블", "수족 냉증 및 순환 장애"],
      spicy: ["스트레스 받으면 맵고 짠 배달 음식 시키는 버릇", "먹고 눕기만 해서 생기는 역류성 식도염", "움직이질 않아서 꽉 막힌 쓰레기 혈액순환", "살찌면 남 탓, 체질 탓 하는 구차한 변명"]
    }
  },
  metal: { 
    overview: {
      mild: "폐, 대장, 호흡기 쪽이 약할 수 있습니다. 건조한 환경에 취약하니 평소 실내 습도 조절과 수분 섭취가 매우 중요합니다.",
      spicy: "기관지와 대장이 매우 취약합니다. 숨쉬기 운동 말고는 몸을 안 움직이니 면역력이 바닥을 칩니다. 환절기마다 골골대는 거 안 지겹습니까?"
    }, 
    points: {
      mild: ["기관지염, 비염 등 호흡기 질환", "장 트러블 (변비나 잦은 배탈)", "피부 건조 및 알레르기", "뼈/관절의 시림"],
      spicy: ["미세먼지 핑계로 운동 절대 안 하는 극강의 게으름", "물 대신 커피만 들이붓는 심각한 수분 부족", "조금만 찬 바람 불면 비염으로 징징대는 약골 체질", "장 관리 안 해서 허구한 날 화장실 직행"]
    }
  },
  water: { 
    overview: {
      mild: "신장, 방광, 혈액순환에 주의가 필요합니다. 몸이 잘 붓거나 차가워지기 쉬운 체질이므로 체온 유지가 필수입니다.",
      spicy: "신장과 비뇨기가 최약체라 아침마다 퉁퉁 붓는 걸 달고 삽니다. 우울감에 빠져 술 퍼마시고 밤새면 진짜 명줄 짧아지는 지름길입니다."
    }, 
    points: {
      mild: ["아침 저녁 심한 붓기", "허리 및 하체 관절 통증", "비뇨기 관련 약화", "우울감이나 무기력증 호소"],
      spicy: ["짠 거 처먹고 아침에 부었다고 징징거리기", "움직이기 귀찮아서 허리디스크 자초하기", "우울할 때마다 폭음으로 방광 망가뜨리기", "체온 관리 안 해서 냉증 달고 살기"]
    }
  }
};

const REL_TRAITS = {
  wood: { 
    overview: "다정다감하고 사람들을 잘 챙기지만, 한 번 마음이 상하면 뒤돌아보지 않는 단호함이 숨어 있습니다.", 
    spouse: "연인이나 배우자에게 아이처럼 순수한 애정을 원하며, 가르치려 하기보다 함께 성장할 수 있는 동반자를 찾습니다.", 
    tips: { mild: ["상대의 간섭을 통제로 느끼지 않기", "서운함이 쌓이기 전에 대화로 풀기"], spicy: ["제발 남 가르치려 드는 오만한 꼰대짓 당장 멈추기", "삐지면 티 팍팍 내면서 상대가 독심술로 알아주길 바라는 유치한 행동 버리기"] }
  },
  fire: { 
    overview: "감정 표현이 솔직하고 열정적이라 주변에 사람이 많지만, 쉽게 타오르고 쉽게 식을 수 있는 기복이 있습니다.", 
    spouse: "나를 자랑스럽게 여겨주고 인정해주는 사람, 시각적인 매력과 리액션이 좋은 배우자에게 크게 끌립니다.", 
    tips: { mild: ["감정이 격해졌을 때는 말 멈추기", "상대의 조용한 애정 방식도 존중하기"], spicy: ["욱해서 뱉은 막말로 상대방 가슴에 대못 박고 나중에 후회하지 않기", "세상이 나를 중심으로 돌아간다는 이기적인 태도 버리기"] }
  },
  earth: { 
    overview: "포용력이 넓고 연장자처럼 듬직하여 주변에서 고민 상담을 많이 해오지만, 정작 내 속마음은 아무에게나 잘 꺼내지 않습니다.", 
    spouse: "변함없이 나를 지켜주고 안정감을 주는 사람, 묵묵히 내 편이 되어주는 어른스러운 배우자를 원합니다.", 
    tips: { mild: ["가끔은 내 약점이나 고민도 솔직하게 털어놓기", "고집을 꺾고 먼저 사과해보기"], spicy: ["속마음은 꽁꽁 숨겨두고 왜 안 알아주냐고 상대방 탓하지 않기", "본인이 틀렸으면 제발 우기지 말고 쿨하게 미안하다고 사과하기"] }
  },
  metal: { 
    overview: "맺고 끊음이 확실하여 사람 사귈 때 선을 잘 긋습니다. 신뢰가 깨지면 즉각 관계를 깔끔하게 정리합니다.", 
    spouse: "책임감이 강하고 약속을 잘 지키는 사람, 서로의 선과 사생활을 쿨하게 존중해주는 배우자를 선호합니다.", 
    tips: { mild: ["너무 날카로운 팩트 폭력 자제하기", "가끔은 빈틈을 보여주며 다가가기"], spicy: ["팩트 폭력이라는 명분으로 칼날 날리며 우월감 느끼는 짓 버리기", "칼같이 선 긋고 차갑게 대해서 멀쩡한 연인 외롭게 만들지 않기"] }
  },
  water: { 
    overview: "친화력이 좋아 누구와도 잘 맞추지만, 속을 알 수 없다는 말을 종종 듣고 혼자만의 에너지를 충전하는 시간이 꼭 필요합니다.", 
    spouse: "나의 깊은 생각과 감수성을 이해해주는 사람, 대화가 끊이지 않는 지적인 배우자와 아주 잘 맞습니다.", 
    tips: { mild: ["혼자만의 생각에 빠져 상대를 외롭게 두지 않기", "내 감정을 적극적으로 말로 표현하기"], spicy: ["불만 생기면 동굴로 잠수 타서 상대방 피 말리게 하는 최악의 버릇 고치기", "음침하게 속으로 삭히지 말고 제발 입 밖으로 꺼내서 똑바로 말하기"] }
  }
};

const CHILDREN_TRAITS = {
  wood: { overview: "자녀를 통제하기보다는 자유롭게 뛰어놀며 스스로 성장하도록 돕는 '방목형' 부모에 가깝습니다.", points: ["자녀와 친구처럼 편안한 관계 형성", "결과보다 과정을 칭찬하는 양육 방식"] },
  fire: { overview: "자녀의 재능을 일찍 발견하고 열정적으로 지원해 주는 에너지가 넘치는 부모입니다.", points: ["적극적인 교육과 다양한 경험 제공", "자녀의 성취에 함께 기뻐하는 리액션"] },
  earth: { overview: "자녀에게 가장 안정적인 환경을 제공하며 흔들림 없이 묵묵히 기다려주는 든든한 부모입니다.", points: ["신뢰를 바탕으로 한 일관된 양육", "정서적인 안정감과 책임감 부여"] },
  metal: { overview: "자녀에게 옳고 그름의 기준을 명확히 가르치며 자립심을 길러주는 원칙주의 부모입니다.", points: ["예절과 규칙을 중요시하는 교육", "이성적인 조언으로 독립심 고취"] },
  water: { overview: "자녀의 감정에 세심하게 공감하고 억압보다는 대화로 문제를 풀어가는 지혜로운 부모입니다.", points: ["풍부한 감수성으로 정서적 교감", "유연하고 수용적인 열린 교육"] }
};

const MATCH_TIMING = [
  { year: "2026", name: "신뢰와 안착의 해", desc: "두 분이 미래에 대한 중요한 약속을 하거나 큰 뜻(결혼, 동업, 이사 등)을 함께 실행에 옮기기 가장 좋은 시기가 다가오고 있습니다." },
  { year: "2027", name: "자산 확장과 결실의 해", desc: "두 사람이 힘을 합쳐 경제적인 기반을 탄탄히 다지고, 주변의 축하를 받으며 눈에 기분 좋은 공동의 성과를 이루어내기 아주 좋은 시기입니다." },
  { year: "2025", name: "새로운 도약과 전환점", desc: "오래된 갈등이나 불안 요소는 훌훌 털어버리고 서로에 대한 확신이 강해지며, 함께 완전히 새로운 환경으로 나아가기 좋은 해입니다." }
];

const MATCH_RELATIONS = {
  same: {
    title: "친구처럼 편안하고 평등한 동반자 관계",
    element_match: "{my}과(와) {part}의 만남으로, 같은 오행의 기운을 나누어 가져서 서로 말하지 않아도 통하는 공감대가 큽니다. 가치관이 비슷해 함께 무언가를 도모하기 좋습니다.",
    conflict: { mild: "가까운 만큼 서로 고집을 꺾지 않으려 할 수 있습니다. 다툼이 생기면 논리보다 '우리는 한 편'이라는 동질감을 먼저 확인시키세요.", spicy: "서로 지기 싫어서 바닥까지 긁어대는 징글징글한 자존심 싸움의 온상입니다." },
    chemistry: "함께 있을 때 긴장이 스르르 풀리는 '거울' 같은 인연입니다. 남들 앞에서 보여주지 못한 내 진짜 모습을 편안하게 드러낼 수 있습니다.",
    advice: { 
      mild: ["서로에게 지나치게 익숙해져서 예의를 잃지 않도록 주의하세요.", "비슷한 단점을 공유하므로, 함께 문제를 개선해나가는 목표를 세우면 좋습니다.", "자존심 대결보다는 서로를 있는 그대로 인정하는 여유가 필요합니다."],
      spicy: ["둘 중 하나라도 굽히지 않으면 파국뿐입니다. 못난 고집 좀 꺾으세요.", "똑같은 단점을 가지고 서로 지적질하는 '내로남불'부터 당장 멈추세요.", "연애/동업이 이기려고 하는 겁니까? 양보 없으면 답도 없는 인연입니다."]
    },
    final_verdict: { mild: "서로의 다름을 조금만 양보하면 평생을 함께할 가장 든든한 소울메이트입니다.", spicy: "거울 보고 자기 단점 욕하는 꼴입니다. 똥고집 꺾을 자신 없으면 1년 안에 볼장 다 봅니다." }
  },
  produce: {
    title: "내가 한없이 품어주고 챙겨주고 싶은 관계",
    element_match: "나의 기운({my})이 상대의 기운({part})을 도와주는 상생의 구조입니다. 본능적으로 상대방을 챙겨주고 베풀고 싶은 마음이 듭니다.",
    conflict: { mild: "나는 계속 주는데 상대는 당연하게 여긴다고 느낄 때 서운함이 폭발합니다. 상대방도 나름의 방식으로 감사하고 있음을 말로 꼭 표현해달라고 요청하세요.", spicy: "한 명은 노예처럼 퍼주고 한 명은 그게 당연한 권리인 줄 아는 최악의 기형적 호구 관계입니다." },
    chemistry: "마치 부모가 자식을 아끼듯 조건 없는 호감이 솟아나는 따뜻한 케미입니다. 내가 주는 사랑이 곧 나의 기쁨이 되는 관계입니다.",
    advice: { 
      mild: ["때로는 내가 다 해주기보다 상대방이 스스로 할 수 있도록 지켜봐 주는 여유가 필요합니다.", "희생한다고 생각하지 말고, 베푸는 과정 자체를 즐겨야 오래갑니다.", "나의 감정도 중요함을 상대방에게 부드럽게 자주 전달하세요."],
      spicy: ["퍼주는 사람은 셀프 호구짓 좀 그만하고, 받는 사람은 제발 양심 좀 챙기세요.", "혼자 희생자 코스프레 하면서 상대방 죄책감 들게 만드는 짓 당장 멈추세요.", "받은 게 있으면 입 싹 닦지 말고 무조건 배로 갚아야 관계가 유지됩니다."]
    },
    final_verdict: { mild: "따뜻한 배려와 헌신이 돋보이는 매우 이상적이고 아름다운 결합입니다.", spicy: "한 명의 뼈를 갈아서 다른 한 명을 배불리는 심각한 가스라이팅 위험 군입니다." }
  },
  produced: {
    title: "상대방의 든든한 지원과 헌신을 받는 관계",
    element_match: "상대의 기운({part})이 나의 기운({my})을 북돋아주는 매우 이로운 상생 구조입니다. 상대로부터 정신적/물질적 혜택과 위안을 받습니다.",
    conflict: { mild: "상대방의 간섭이나 잔소리가 나에게 통제로 느껴질 수 있습니다. 애정표현임을 이해하되, 독립적인 영역도 필요함을 다정하게 전달하세요.", spicy: "사랑과 걱정이라는 명목하에 상대를 완전히 통제하려는 숨 막히는 꼰대 가스라이팅입니다." },
    chemistry: "힘들고 지칠 때 상대방에게 기대고 싶은 든든한 보호막 같은 케미입니다. 나를 지지해주는 사람 덕분에 자신감이 차오릅니다.",
    advice: { 
      mild: ["받는 것에만 익숙해지지 말고, 상대방의 수고로움에 먼저 감사와 칭찬을 표현하세요.", "상대방이 나를 위해 조언할 때, 방어적으로 반응하지 말고 경청해 보세요.", "가끔은 내가 먼저 상대방을 리드하며 색다른 모습을 보여주세요."],
      spicy: ["'다 너 잘되라고 하는 소리'라는 기만적인 핑계로 상대를 옥죄고 숨 막히게 하지 마세요.", "당신은 파트너의 부모도, 선생님도 아닙니다. 가르치려 드는 오만을 버리세요.", "지나친 의존성을 버리고 제발 각자 자기 인생의 무게는 스스로 감당하세요."]
    },
    final_verdict: { mild: "나침반처럼 나를 이끌어주는 귀인을 만났으니, 감사함을 잊지 말고 꼭 잡으세요.", spicy: "성인병 걸리기 딱 좋은 과보호 관계. 상대방에게 기대서 기생충처럼 살지 마세요." }
  },
  control: {
    title: "강한 끌림과 텐션이 존재하는 정복의 관계",
    element_match: "나의 기운({my})이 상대의 기운({part})을 통제하려는 구조입니다. 처음부터 서로에게 알 수 없는 강렬한 끌림을 느끼며 묘한 긴장감이 흐릅니다.",
    conflict: { mild: "내가 상대를 내 방식대로 통제하고 리드하려다 갈등이 생깁니다. 상대방의 있는 그대로의 특성을 존중하고 한 발 물러서 주는 연습이 필수입니다.", spicy: "서로 상대방 목줄을 쥐고 흔들어서 내 발밑에 두려는 피곤한 권력 투쟁입니다." },
    chemistry: "나와 전혀 다른 상대방의 매력에 자석처럼 끌리는 짜릿한 케미입니다. 서로를 극복하고 알아가는 과정 자체가 매우 흥미롭습니다.",
    advice: { 
      mild: ["상대방을 내 뜻대로 바꾸려 하지 말고, 서로의 다름을 매력으로 받아들이세요.", "결정을 내릴 때 내 의견만 앞세우지 말고 반드시 상대의 의사를 먼저 물어보세요.", "지배하려 하지 말고 파트너로서 동등하게 의견을 조율하세요."],
      spicy: ["상대방을 내 입맛대로 개조하려는 미친 통제욕과 오만함을 당장 버리세요.", "누가 더 기가 센지 이겨먹으려고 만납니까? 제발 동등한 파트너로 대하세요.", "상대의 본성을 있는 그대로 인정하지 못하겠으면 당장 헤어지는 게 서로에게 좋습니다."]
    },
    final_verdict: { mild: "적절한 긴장감이 관계를 오래 유지시키는 매력적인 스파크가 됩니다.", spicy: "누가 위인지 서열 정리하다가 쌍코피 터지고 너덜너덜해져서 헤어질 팔자입니다." }
  },
  controlled: {
    title: "서로에게 긴장감을 주며 발전하는 자극제 관계",
    element_match: "상대의 기운({part})이 나를 제어하고 올바른 길로 이끌어주려는 구조입니다. 서로 배울 점이 많다고 느끼며, 묘한 끌림과 책임감이 형성됩니다.",
    conflict: { mild: "상대방의 규칙이나 원칙이 나에게는 답답한 압박으로 다가올 수 있습니다. 다투기보다는 '나는 이렇게 할 때 더 편해'라고 나의 속도를 설명해주세요.", spicy: "상대를 위한다는 핑계로 팩트 폭력을 날리며 서로의 자존감을 바닥까지 깎아내리는 관계입니다." },
    chemistry: "상대방을 존경하고 의지하게 되며, 함께 있을 때 나 자신이 더 나은 사람이 되고 싶어지는 긍정적인 성장의 케미입니다.",
    advice: { 
      mild: ["지나치게 상대방의 눈치를 보지 말고 나의 솔직한 감정을 자주 공유하세요.", "서로 예의를 지키는 선을 유지하면 관계가 훨씬 매끄럽게 지속됩니다.", "상대방의 조언을 잔소리로 여기지 말고 성장의 발판으로 삼아보세요."],
      spicy: ["팩트 폭력이라는 무기로 상대방 기죽이면서 본인 우월감 채우는 비열한 짓 당장 멈추세요.", "기본적인 존중이 없으면 이 관계는 지옥불입니다. 제발 선 좀 넘지 마세요.", "현미경 들이대며 서로 단점만 들춰내지 말고, 좋은 점만 보려고 이 악물고 노력하세요."]
    },
    final_verdict: { mild: "서로를 존중하고 예의를 갖춘다면 가장 완벽한 성장 파트너가 됩니다.", spicy: "상대방 깎아내려서 쾌감 느끼는 변태적인 관계가 되기 전에 선을 지키세요." }
  }
};

const DAILY_FORTUNES = {
  same: { 
    title: { mild: "나의 주관대로\n당당하게 나아가는 하루", spicy: "고집불통 독불장군\n주변 사람 다 떠나는 날" }, 
    desc: { mild: "나의 에너지가 강해지는 날입니다. 주변의 간섭에 흔들리기보다 내 직관을 믿고 밀어붙이는 것이 좋은 결과를 가져옵니다.", spicy: "내 말만 맞다고 우기다간 철저하게 망신만 당합니다. 쓸데없는 자존심은 쓰레기통에 처박고 제발 주변 사람 말 좀 들으세요." } 
  },
  produce: { 
    title: { mild: "활기찬 에너지로\n숨은 능력을 발휘하는 날", spicy: "나대다가 호되게\n망신 당하기 딱 좋은 날" }, 
    desc: { mild: "표현력과 재치가 빛나는 하루입니다. 미뤄뒀던 아이디어를 제안하거나 긍정적인 말로 주변 사람들에게 활력을 불어넣어 보세요.", spicy: "분위기 파악 못하고 입방정 떨면 공들인 탑이 한순간에 무너집니다. 낄 데 안 낄 데 제발 구분하고 입 조심하세요." } 
  },
  control: { 
    title: { mild: "바쁘게 움직인 만큼\n확실한 결실을 맺는 날", spicy: "눈앞의 푼돈 좇다가\n큰 사람 다 잃는 날" }, 
    desc: { mild: "현실적인 감각이 예리해지고 금전적인 성과를 기대해 볼 만합니다. 꼼꼼하게 목표를 점검하고 우선순위에 집중하세요.", spicy: "눈앞의 이익만 따지며 얄팍하게 계산기 두드리다가 주변에서 쩨쩨하다는 손가락질만 받습니다. 소탐대실의 전형적인 하루입니다." } 
  },
  controlled: { 
    title: { mild: "책임감 있는 태도로\n깊은 신뢰를 얻는 날", spicy: "남의 시선 신경 쓰다가\n완벽하게 호구 잡히는 날" }, 
    desc: { mild: "어깨가 무거운 역할을 맡을 수 있지만, 그만큼 나의 가치를 증명할 기회입니다. 원칙을 지키며 차분하게 대응하세요.", spicy: "착한 아이 콤플렉스에 빠져 거절도 못하고 덤터기만 오지게 씁니다. 만만한 호구 취급 당하기 싫으면 제발 아닌 건 아니라고 하세요." } 
  },
  produced: { 
    title: { mild: "차분한 휴식 속에서\n지혜를 얻는 하루", spicy: "생각만 핑핑 돌리다가\n하루 다 날려먹는 날" }, 
    desc: { mild: "새로운 일을 무리하게 벌이기보다 한 템포 쉬어가는 것이 유리합니다. 생각을 정리하고 문서나 기록을 꼼꼼히 살피세요.", spicy: "머릿속으로 시뮬레이션만 백날 천날 돌리면 뭐합니까? 핑계 좀 그만 대고 당장 이불 박차고 일어나서 뭐라도 하나 실행에 옮기세요." } 
  }
};

const getTenDeity = (myElem, targetElem) => {
  if (myElem === targetElem) return { id: 'same', name: '비겁(比劫)' }; // 비견/겁재
  if (
    (myElem === 'wood' && targetElem === 'fire') ||
    (myElem === 'fire' && targetElem === 'earth') ||
    (myElem === 'earth' && targetElem === 'metal') ||
    (myElem === 'metal' && targetElem === 'water') ||
    (myElem === 'water' && targetElem === 'wood')
  ) return { id: 'produce', name: '식상(食傷)' }; // 식신/상관
  if (
    (myElem === 'wood' && targetElem === 'earth') ||
    (myElem === 'fire' && targetElem === 'metal') ||
    (myElem === 'earth' && targetElem === 'water') ||
    (myElem === 'metal' && targetElem === 'wood') ||
    (myElem === 'water' && targetElem === 'fire')
  ) return { id: 'control', name: '재성(財星)' }; // 정재/편재
  if (
    (targetElem === 'wood' && myElem === 'earth') ||
    (targetElem === 'fire' && myElem === 'metal') ||
    (targetElem === 'earth' && myElem === 'water') ||
    (targetElem === 'metal' && myElem === 'wood') ||
    (targetElem === 'water' && myElem === 'fire')
  ) return { id: 'controlled', name: '관성(官星)' }; // 정관/편관
  return { id: 'produced', name: '인성(印星)' }; // 정인/편인
};

const DAEUN_DICT = {
  same: {
    3: { keyword: "독립과 경쟁", desc: { mild: "자립심이 강해지고 온전한 사회적 독립을 이룩하는 시기입니다. 주변 동료와의 치열한 경쟁 속에서 나만의 무기와 멘탈을 날카롭게 갈고닦게 됩니다.", spicy: "근거 없는 자신감으로 똘똘 뭉쳐 주변 사람 피곤하게 만드는 시기. 쓸데없는 고집 부리다 패가망신하지 말고 제발 귀 좀 열고 사세요." }, type: "neutral" },
    4: { keyword: "협력과 주관", desc: { mild: "동료나 파트너와의 협력, 그리고 보이지 않는 경쟁이 교차하는 시기입니다. 내 주관을 밀어붙여 일의 규모를 키울 수 있는 강한 돌파력이 들어옵니다.", spicy: "동업이랍시고 사람 믿다가 뒤통수 쎄게 맞고 피눈물 흘리기 딱 좋은 시기입니다. 섣부른 자만심으로 빚잔치하기 싫으면 혼자 조용히 일하세요." }, type: "warning" },
    5: { keyword: "권한과 리더십", desc: { mild: "주변을 아우르는 지위가 확고해지며, 뚝심 있게 내 사업이나 조직을 이끌어갑니다. 사람 관리를 어떻게 하느냐가 곧 재물의 크기로 연결됩니다.", spicy: "본인이 왕인 줄 착각하고 아랫사람 쥐어짜다가 꼰대 소리 듣고 전부 등 돌리게 됩니다. 사람 귀한 줄 모르면 이 시기에 모은 돈 전부 날아갑니다." }, type: "good" },
    6: { keyword: "명예와 2막", desc: { mild: "흔들림 없는 주체성을 지키며 새로운 인생 2막의 판을 짜는 시기입니다. 오랜 경험을 바탕으로 주변 사람들을 챙기고 존경을 받게 됩니다.", spicy: "나이 먹고도 아집을 못 버려서 '라떼는 말이야' 시전하다가 주변에 파리 한 마리 안 남습니다. 제발 지갑은 열고 입은 닫으세요." }, type: "neutral" }
  },
  produce: {
    3: { keyword: "진로 개척", desc: { mild: "본격적인 진로를 개척하고 나의 숨겨진 재능을 세상에 적극적으로 알리는 역동적인 시기입니다. 활동 반경이 크게 넓어지고 이동수도 잦습니다.", spicy: "능력도 안 되면서 하고 싶은 것만 많아서 이것저것 찔러보다가 시간만 버리는 꼴입니다. 헛바람 빼고 우물 하나만 파세요." }, type: "good" },
    4: { keyword: "성과와 확장", desc: { mild: "새로운 프로젝트나 사업 확장에 매우 유리한 운기입니다. 머릿속 아이디어가 곧 실질적인 성과로 연결되어 몸이 두 개라도 모자랄 만큼 바쁘게 움직입니다.", spicy: "운 좋게 돈 좀 벌었다고 간이 배 밖으로 나와서 일 벌이다가 감당 못 하고 무너집니다. 설치지 말고 들어온 돈 꽉 쥐고 지키세요." }, type: "good" },
    5: { keyword: "혁신과 소모", desc: { mild: "기존의 낡은 틀을 깨고 아랫사람을 이끌며 혁신을 주도합니다. 능력을 크게 인정받으나, 무리한 활동으로 체력 소모가 클 수 있으니 건강에 유의해야 합니다.", spicy: "일중독에 빠져서 몸 망가지는 줄 모르고 혹사당하는 시기. 돈 벌어서 병원비로 다 갖다 바치기 싫으면 제발 휴식 좀 취하세요." }, type: "warning" },
    6: { keyword: "여유와 후학", desc: { mild: "그동안 축적한 기술이나 지식을 활용해 여유로운 활동을 이어갑니다. 좋아하는 취미가 제2의 직업이 되거나 후학을 양성하기에 아주 좋은 시기입니다.", spicy: "입만 살아서 남 가르치려 들고 잔소리폭격기가 되어버립니다. 아무도 당신의 구시대적 조언 안 궁금해 하니 제발 오지랖 좀 끄세요." }, type: "neutral" }
  },
  control: {
    3: { keyword: "경제적 감각", desc: { mild: "현실적인 감각이 예리하게 깨어나고 금전적인 목표가 뚜렷해지는 시기입니다. 또래보다 일찍 경제적 기반을 다지고 돈의 흐름을 읽는 기회를 얻게 됩니다.", spicy: "눈앞에 돈만 쫓다가 정작 중요한 사람 다 잃고 싼티나게 구는 시기입니다. 푼돈 아끼려다 큰 기회 날리기 딱 좋습니다." }, type: "good" },
    4: { keyword: "재물 축적기", desc: { mild: "그동안 치열하게 뿌린 씨앗이 눈에 보이는 확실한 금전적 보상으로 돌아오는 황금기입니다. 자산 증식과 재테크, 사업적 성공에 매우 유리한 10년입니다.", spicy: "돈이 굴러들어오니 세상이 만만해 보이죠? 이때 겸손하지 못하고 사치 부리거나 무리한 투자하면 10년 고생 한방에 끝납니다." }, type: "good" },
    5: { keyword: "자산의 확장", desc: { mild: "재물운이 정점에 달하며, 내가 굴리는 자산의 규모가 인생에서 가장 크게 확장됩니다. 다만 새로운 투자보다는 가진 것을 지키는 리스크 관리가 훨씬 중요합니다.", spicy: "자산 지키려면 숨만 쉬고 있어야 하는 시기입니다. 남들 돈 번다는 소리에 귀 얇아져서 투자하는 순간 계좌 녹아내립니다." }, type: "warning" },
    6: { keyword: "풍요와 안정", desc: { mild: "안정적인 현금 흐름을 바탕으로 삶의 질과 여유를 높이는 시기입니다. 섣부른 확장만 피한다면 넉넉하고 풍요로운 노후의 기반을 온전히 즐길 수 있습니다.", spicy: "노욕에 눈 멀어서 늙막에 사기 당하기 딱 좋은 운입니다. 평생 모은 돈 남 좋은 일 시키기 싫으면 인감도장 꼭꼭 숨겨두세요." }, type: "good" }
  },
  controlled: {
    3: { keyword: "소속과 인정", desc: { mild: "취업, 시험 합격, 결혼 등 소속과 규율이 명확하게 정해지는 시기입니다. 윗사람이나 조직의 인정을 받으며 사회 내에서 빠르게 내 자리를 잡아갑니다.", spicy: "스스로 족쇄 차고 노예가 되는 시기. 조직 눈치 보느라 자기 목소리 한 번 못 내고 스트레스로 멘탈만 탈탈 털립니다." }, type: "good" },
    4: { keyword: "책임과 압박", desc: { mild: "승진이나 명예 상승의 기운이 매우 강하게 들어옵니다. 중요한 직책을 맡아 권한이 커지는 만큼, 그에 따르는 막중한 책임감과 스트레스를 굳건히 견뎌내야 합니다.", spicy: "자리 하나 올라갔다고 좋아할 게 아닙니다. 온갖 책임 덤터기 쓰고 총알받이 돼서 화병으로 쓰러질 수 있으니 제발 적당히 나대세요." }, type: "warning" },
    5: { keyword: "사회적 명성", desc: { mild: "조직 내에서 대체 불가한 핵심 리더 역할을 수행하거나, 업계에서 사회적 명성을 크게 얻는 시기입니다. 이제는 내 이름값 자체가 하나의 거대한 브랜드가 됩니다.", spicy: "명예 좇다가 실속은 하나도 못 챙기는 빛 좋은 개살구 시기입니다. 남들 눈에 멋져 보이려고 빈 수레 요란하게 굴리지 마세요." }, type: "good" },
    6: { keyword: "공로와 자문", desc: { mild: "오랜 기간 묵묵히 쌓아온 공로를 세상에 인정받고 명예로운 자리에 오릅니다. 직접 실무를 뛰기보다는 방향성을 제시하는 자문 역할에서 큰 역량을 발휘합니다.", spicy: "과거 영광에 취해서 훈수나 두는 꼰대 취급 받습니다. 당신 시대는 끝났으니 조용히 박수 칠 때 떠나는 법을 배우세요." }, type: "neutral" }
  },
  produced: {
    3: { keyword: "공인과 자격", desc: { mild: "학위, 전문 자격증 취득 등 문서 운과 배움의 운이 강하게 들어옵니다. 확실한 라이선스로 내 실력을 공인받아 탄탄한 커리어의 훌륭한 출발점이 됩니다.", spicy: "현실 감각 제로 상태로 골방에 틀어박혀 쓰지도 않을 자격증만 수집하는 무능력한 시기. 핑계 대지 말고 밖으로 나가서 돈부터 버세요." }, type: "neutral" },
    4: { keyword: "문서와 귀인", desc: { mild: "결정적인 순간에 윗사람(귀인)의 조력이나 중요한 계약, 부동산 등의 유리한 문서 운이 따릅니다. 성급한 행동보다는 신중한 기획과 서포트가 큰 승리를 가져옵니다.", spicy: "엄마 품 못 벗어난 캥거루처럼 남에게 징징대고 의존성만 끝판왕 찍는 시기입니다. 당신 인생 대신 살아줄 사람 없으니 정신 좀 차리세요." }, type: "good" },
    5: { keyword: "지적 자산", desc: { mild: "풍부한 경험을 바탕으로 눈에 보이지 않는 지적 자산, 특허, 저작권 등을 통해 수익 창출합니다. 밖으로 무리하게 뛰기보다 내실을 깊게 다져야 하는 시기입니다.", spicy: "생각만 우주 끝까지 뻗어나가고 행동은 1도 안 하는 극강의 게으름뱅이 시기입니다. 입만 털지 말고 제발 실천 하나라도 하세요." }, type: "neutral" },
    6: { keyword: "자산 시스템", desc: { mild: "부동산 임대나 이자 수익 등 흔들림 없는 안정적인 자산 구조가 비로소 완성되는 시기입니다. 현실의 치열함에서 벗어나 마음의 평안과 정신적 성장을 추구합니다.", spicy: "세상사에 무관심해져서 고집스러운 독거노인 루트 타기 딱 좋습니다. 사람들과 소통 안 하면 그깟 자산 끌어안고 외롭게 늙습니다." }, type: "good" }
  }
};

const calculateDaeunNum = (birthDateStr, isForward) => {
  const bDate = new Date(birthDateStr);
  const d = bDate.getDate();
  let daysDiff = 0;
  if (isForward) {
    if (d < 6) daysDiff = 6 - d;
    else daysDiff = 30 - d + 6;
  } else {
    if (d >= 6) daysDiff = d - 6;
    else daysDiff = d + 30 - 6;
  }
  let daeunNum = Math.round(daysDiff / 3);
  if (daeunNum === 0) daeunNum = 1;
  if (daeunNum > 10) daeunNum = 10;
  return daeunNum;
};

const generateDaeunFlow = (pillars, gender, birthDateStr) => {
  const myElem = pillars.day.stem.element;
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(pillars.year.stem.char);
  const isForward = (gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear);
  const direction = isForward ? 1 : -1;
  
  const mStemIdx = CHEONGAN.findIndex(c => c.char === pillars.month.stem.char);
  const mBranchIdx = JIJI.findIndex(j => j.char === pillars.month.branch.char);
  
  const daeunNum = calculateDaeunNum(birthDateStr, isForward);
  const result = [];
  
  for (let step = 3; step <= 6; step++) {
    let sIdx = (mStemIdx + (step * direction)) % 10;
    if (sIdx < 0) sIdx += 10;
    let bIdx = (mBranchIdx + (step * direction)) % 12;
    if (bIdx < 0) bIdx += 12;
    
    const dStem = CHEONGAN[sIdx];
    const dBranch = JIJI[bIdx];
    
    const startAge = daeunNum + ((step - 1) * 10);
    const endAge = startAge + 9;
    
    const deityObj = getTenDeity(myElem, dBranch.element);
    const dict = DAEUN_DICT[deityObj.id][step];

    result.push({
      age: `${startAge}~${endAge}세`,
      startAge: startAge,
      period: `${dStem.kor}${dBranch.kor}(${dStem.char}${dBranch.char}) 대운 - ${deityObj.name}의 기운`,
      keyword: dict.keyword,
      desc: { mild: dict.desc.mild, spicy: dict.desc.spicy },
      type: dict.type,
      score: dict.type === 'good' ? 90 : dict.type === 'warning' ? 45 : 70
    });
  }
  return result;
};

const YEARLY_POOLS = [
  {
    title: "크게 도약하거나, 변화를 맞이하는 승부의 해", 
    summary: { 
      mild: "가만히 머무르는 해가 아니라 일이 많아지고 나의 역할이 커지는 도약의 시기입니다. 바쁜 만큼 얻는 것이 확실합니다.", 
      spicy: "편하게 놀고먹을 생각은 꿈도 꾸지 마세요. 뼈 빠지게 고생하고 책임만 잔뜩 떠안아서 도망가고 싶어질 환장할 시기입니다." 
    },
    keywords: ["책임 증가", "규모 확대", "대외 활동", "실력 입증", "멘탈 관리"],
    career: { good: ["새로운 프로젝트 리드", "제안서/발표/심사", "명예가 올라가는 승진/이직"], bad: ["준비 안 된 무리한 확장", "사람과의 구설수"] },
    wealth: { in: ["전문성 기반 수익 증가", "신뢰가 바탕이 된 새로운 계약"], out: ["체면 유지를 위한 지출", "스트레스 해소용 비용"] },
    quarters: [
      { q: "Q1", title: "준비와 기획 (1~3월)", desc: { mild: "급하게 행동하기보다 올 한 해의 굵직한 방향성을 설정하고 필요한 인맥을 구축하는 시기입니다.", spicy: "잔머리 굴리면서 요행 바라지 말고 묵묵히 엎드려서 기본기나 닦으세요." } },
      { q: "Q2", title: "역동적 실행 (4~6월)", desc: { mild: "생각해둔 계획을 행동으로 옮기며 눈코 뜰 새 없이 바빠집니다. 외부 제안이 쏟아집니다.", spicy: "오지랖 부리다가 남의 똥까지 치워주며 과로사하기 딱 좋은 분기. 거절 못하면 죽습니다." } },
      { q: "Q3", title: "최고조의 텐션 (7~9월)", desc: { mild: "에너지가 정점에 달하며 실질적인 성과가 드러나기 시작합니다. 단, 체력 고갈을 주의하세요.", spicy: "성질 뻗쳐서 주변 사람 다 쳐내고 혼자 고립될 위기입니다. 입 다물고 성질 꾹 누르세요." } },
      { q: "Q4", title: "확장과 수확 (10~12월)", desc: { mild: "올해의 성과를 보상받고 내년을 위해 영역을 안정적으로 확장하는 든든한 마무리 시기입니다.", spicy: "돈 좀 들어온다고 샴페인 일찍 터뜨리다간 내년에 손가락 빱니다. 철저히 숨기세요." } }
    ],
    detailed_monthly: [
      { month: 1, title: "계획 수립", desc: "새로운 한 해의 밑그림을 그리는 시기입니다. 서두르지 말고 장기 방향을 점검하세요." },
      { month: 2, title: "인맥 형성", desc: "새로운 만남이 잦아집니다. 나를 도와줄 귀인을 찾기 좋은 달이니 대인관계에 신경 쓰세요." },
      { month: 3, title: "기반 다지기", desc: "본격적인 실행을 앞두고 씨앗을 심는 달입니다. 중요한 문서를 꼼꼼히 확인하세요." },
      { month: 4, title: "적극적 실행", desc: "생각만 하던 것을 행동으로 옮길 때입니다. 자신감을 가지고 거침없이 나아가세요." },
      { month: 5, title: "활동량 증가", desc: "일이 점차 빠르게 돌아갑니다. 외부 요청이나 새로운 제안이 활발히 들어옵니다." },
      { month: 6, title: "중간 점검", desc: "숨을 고르며 상반기의 성과를 돌아보고 하반기 전략을 수정 및 보완하는 시기입니다." },
      { month: 7, title: "최고조의 기운", desc: "올해 중 에너지가 가장 강하게 몰리는 시기입니다. 큰 성과를 얻을 수 있으나 압박감도 큽니다." },
      { month: 8, title: "위기 관리", desc: "예상치 못한 변수나 딜레이가 생길 수 있으니 플랜 B를 준비하고 꼼꼼한 확인이 필요합니다." },
      { month: 9, title: "안정적 결실", desc: "상반기의 노력에 대한 보상이 금전이나 명예의 형태로 나타나기 시작합니다." },
      { month: 10, title: "확장과 재투자", desc: "얻은 결실을 바탕으로 나의 무대나 업무 영역을 한 단계 더 넓히기 좋은 시기입니다." },
      { month: 11, title: "내실 다지기", desc: "새로운 일보다는 현재 가진 것을 지키고 시스템을 다듬는 데 집중해야 합니다." },
      { month: 12, title: "성공적 마무리", desc: "한 해의 굵직한 성과를 축하하며, 다음 해의 도약을 위한 충분한 체력을 비축하세요." }
    ],
    core_advice: {
      mild: ["새 일을 만들기보다 기존 역량을 확실히 어필하세요.", "중요한 약속은 꼭 문서나 기록으로 남겨두세요.", "체력과 감정 관리가 곧 가장 훌륭한 운의 관리입니다."],
      spicy: "올해 당신은 본인의 알량한 능력만 믿고 일을 벌이다가 크게 뒤통수를 맞을 확률이 매우 높습니다. 특히 다가오는 사람들을 맹신하지 마세요. 당신에게 '이거 좋다, 저거 해보자' 달콤하게 속삭이는 사람들은 전부 당신을 이용해 먹으려는 흡혈귀들입니다. 남의 말 듣고 빚내서 투자하거나 동업하면 100% 망합니다. 철저하게 혼자 고민하고, 지루할 정도로 기본만 지키세요. 억울해도 욱하는 성질 죽이고 바보처럼 엎드려 있는 것만이 올해 당신이 살아남는 유일한 방법입니다. 강력히 경고했습니다. 절대 설치지 마세요."
    }
  },
  {
    title: "차곡차곡 내실 다지며 안정으로 접어드는 해", 
    summary: { 
      mild: "새로운 것을 무리하게 벌이기보다는, 지금까지 해온 것들을 정리하고 시스템화하여 온전히 내 것으로 굳히는 시기입니다.", 
      spicy: "뭐 대단한 거 해보겠다고 깝치지 말고 하던 거나 똑바로 지키세요. 욕심부려서 나대는 순간 가졌던 것마저 싸그리 날아갑니다." 
    },
    keywords: ["내실 다지기", "문서 운", "자산 안정", "휴식과 충전", "가족과의 시간"],
    career: { good: ["기존 업무 효율화 및 자동화", "자격증 취득 및 공부", "유리한 문서/계약 체결"], bad: ["충동적인 이직 결정", "생소한 분야로의 갑작스러운 도전"] },
    wealth: { in: ["안정적인 고정 수익 증가", "부동산 및 문서 관련 이득"], out: ["예상치 못한 기기 수리비", "건강 관리를 위한 지출"] },
    quarters: [
      { q: "Q1", title: "재정비와 휴식 (1~3월)", desc: { mild: "지난해의 피로를 풀고 차분하게 문서나 자격을 준비하며 워밍업을 하는 시기입니다.", spicy: "의욕 상실로 번아웃 핑계 대며 퍼져 있기 좋은 달. 이불 박차고 억지로라도 책상에 앉으세요." } },
      { q: "Q2", title: "관계와 정리 (4~6월)", desc: { mild: "불필요한 지출과 인관관계를 깔끔하게 정리하며 삶의 무게를 가볍게 만들어야 합니다.", spicy: "당신 에너지 갉아먹는 쓸모없는 인간관계 싹 다 쳐내세요. 호구 잡히기 딱 좋은 시기입니다." } },
      { q: "Q3", title: "학습과 내면화 (7~9월)", desc: { mild: "자격증이나 새로운 공부를 하기에 집중력이 매우 좋습니다. 내공이 훌쩍 성장합니다.", spicy: "딴짓거리 하지 말고 자격증이든 기술이든 당신 몸값 올릴 생존 무기 하나 무조건 만드세요." } },
      { q: "Q4", title: "소소한 결실 (10~12월)", desc: { mild: "크게 요란하지 않아도 마음을 넉넉하게 하는 안정적인 금전적/정서적 수확이 따릅니다.", spicy: "작은 성과 났다고 우쭐대다간 사기꾼 꼬입니다. 입 꾹 닫고 죽는소리 하면서 웅크리고 있으세요." } }
    ],
    detailed_monthly: [
      { month: 1, title: "휴식과 재정비", desc: "바쁘게 달려온 마음을 가라앉히고 차분하게 한 해의 목표를 현실적으로 세우는 달입니다." },
      { month: 2, title: "소규모의 시작", desc: "너무 크게 벌이지 말고, 소소하고 가벼운 마음으로 올해의 계획에 첫발을 떼보세요." },
      { month: 3, title: "기초 체력 다지기", desc: "운동이나 취미를 시작하여 올 한 해를 안정적으로 이끌어갈 건강과 멘탈을 다지세요." },
      { month: 4, title: "문서와 계약", desc: "사인이나 계약, 부동산 등 문서와 관련된 일에서 나에게 유리한 소식이 들려옵니다." },
      { month: 5, title: "지출 점검", desc: "불필요하게 새어나가는 돈이 없는지 재무 상태를 꼼꼼히 점검하고 통제해야 합니다." },
      { month: 6, title: "관계의 재정립", desc: "주변 인간관계가 한 차례 정리되며, 진짜 내 편이 누구인지 알게 되는 시기입니다." },
      { month: 7, title: "내면의 성장", desc: "외부 활동보다는 혼자만의 시간을 가지며 명상이나 독서로 내면을 채우기 좋은 달입니다." },
      { month: 8, title: "학습과 집중", desc: "무언가를 배우거나 자격증을 준비하기에 집중력이 최고조에 달하는 달입니다." },
      { month: 9, title: "작은 성취", desc: "그동안 묵묵히 준비했던 일에서 작지만 의미 있는 성과나 칭찬이 보이기 시작합니다." },
      { month: 10, title: "소소한 수확", desc: "크진 않아도 마음을 기쁘게 하는 소소한 금전적 이득이나 선물이 들어오는 달입니다." },
      { month: 11, title: "감사의 시간", desc: "주변의 고마운 사람들에게 작은 선물을 하거나 따뜻한 마음을 표현해 보세요." },
      { month: 12, title: "평온한 마무리", desc: "큰 이슈 없이 무탈하고 평온하게 한 해를 갈무리하며 가족과 따뜻한 시간을 보냅니다." }
    ],
    core_advice: {
      mild: ["지금은 전진할 때가 아니라 방어하고 지킬 때입니다.", "주변 사람들의 달콤한 투자 권유를 조심하세요.", "올해 배운 지식과 자격증이 내년의 큰 무기가 됩니다."],
      spicy: "올해 당신의 테마는 '생존과 방어'입니다. 어디 가서 대박 쳐보겠다는 망상은 지금 당장 쓰레기통에 버리세요. 세상에 공짜는 없고, 지금 당신의 직관력과 투자 감각은 최악의 상태입니다. 누군가 당신에게 엄청난 기회라고 접근한다면 그것은 100% 당신 주머니를 노리는 사기극입니다. 화려한 외출이나 무리한 확장은 절대 금물입니다. 답답하더라도 방구석에 틀어박혀서 자기계발만 하세요. 자존심 내세우며 빚내서 투자하거나 퇴사 후 무턱대고 창업하는 순간, 당신 인생의 지옥문이 활짝 열릴 것입니다."
    }
  }
];

const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  return Math.abs(hash);
};

const calculateRealSaju = (dateStr, timeStr, calendarType) => {
  let targetDate = new Date(`${dateStr}T00:00:00`);
  if (calendarType === 'lunar') targetDate.setDate(targetDate.getDate() + 29);
  
  const y = targetDate.getFullYear();
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();

  let sajuYear = y;
  if (m === 1 || (m === 2 && d < 4)) sajuYear -= 1;
  const yStem = (sajuYear - 4 + 10) % 10;
  const yBranch = (sajuYear - 4 + 12) % 12;

  let sajuMonth = m;
  if (d < 5) sajuMonth -= 1;
  if (sajuMonth === 0) sajuMonth = 12;
  
  let mBranch = sajuMonth === 1 ? 1 : (sajuMonth === 12 ? 0 : sajuMonth);
  const baseMonthStems = [2, 4, 6, 8, 0]; 
  let offset = sajuMonth - 2;
  if (offset < 0) offset += 12;
  const mStem = (baseMonthStems[yStem % 5] + offset) % 10;

  const anchorDate = new Date(2000, 0, 1);
  const currentDate = new Date(y, m - 1, d);
  const daysDiff = Math.round((currentDate - anchorDate) / (1000 * 60 * 60 * 24));
  
  let dStem = (4 + daysDiff) % 10;
  if (dStem < 0) dStem += 10;
  let dBranch = (6 + daysDiff) % 12;
  if (dBranch < 0) dBranch += 12;

  let hStem = -1, hBranch = -1;
  if (timeStr !== 'unknown') {
    const hour = parseInt(timeStr.split(':')[0], 10);
    hBranch = Math.floor((hour + 1) % 24 / 2); 
    const baseHourStems = [0, 2, 4, 6, 8]; 
    hStem = (baseHourStems[dStem % 5] + hBranch) % 10;
  }

  return {
    year: { stem: CHEONGAN[yStem], branch: JIJI[yBranch] },
    month: { stem: CHEONGAN[mStem], branch: JIJI[mBranch] },
    day: { stem: CHEONGAN[dStem], branch: JIJI[dBranch] },
    hour: timeStr !== 'unknown' 
      ? { stem: CHEONGAN[hStem], branch: JIJI[hBranch] } 
      : { stem: { char: '?', kor: '모름', element: 'metal' }, branch: { char: '?', kor: '모름', element: 'metal' } }
  };
};

const countElements = (pillars) => {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const countIfValid = (charInfo) => { if (charInfo.element && charInfo.char !== '?') counts[charInfo.element]++; };
  
  countIfValid(pillars.year.stem); countIfValid(pillars.year.branch);
  countIfValid(pillars.month.stem); countIfValid(pillars.month.branch);
  countIfValid(pillars.day.stem); countIfValid(pillars.day.branch);
  countIfValid(pillars.hour.stem); countIfValid(pillars.hour.branch);
  
  return counts;
};

const getNeededElement = (counts, primaryElem) => {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  const lackElems = elements.filter(e => counts[e] === 0);
  if (lackElems.length > 0) return lackElems[0]; 
  
  const excessElems = elements.filter(e => counts[e] >= 3);
  if (excessElems.length > 0) {
    const controllers = { wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth' };
    return controllers[excessElems[0]]; 
  }
  
  const producers = { wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal' };
  return producers[primaryElem];
};

const calculateSinsal = (pillars, hash) => {
  const results = [];
  const dayBranch = pillars.day.branch.char;
  const yearBranch = pillars.year.branch.char;

  const isDoHwa = ['子', '午', '卯', '酉'].includes(dayBranch) || ['子', '午', '卯', '酉'].includes(yearBranch);
  const isYeokMa = ['寅', '申', '巳', '亥'].includes(dayBranch) || ['寅', '申', '巳', '亥'].includes(yearBranch);
  const isHwaGae = ['辰', '戌', '丑', '未'].includes(dayBranch) || ['辰', '戌', '丑', '未'].includes(yearBranch);
  
  const dayStemBranch = pillars.day.stem.char + pillars.day.branch.char;
  const isBaekHo = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'].includes(dayStemBranch);
  const isGoeGang = ['庚辰', '庚戌', '壬辰', '壬戌', '戊戌'].includes(dayStemBranch);

  if(isDoHwa || hash % 5 === 0) results.push('도화');
  if(isYeokMa || hash % 5 === 1) results.push('역마');
  if(isHwaGae || hash % 5 === 2) results.push('화개');
  if(isBaekHo || hash % 7 === 3) results.push('백호');
  if(isGoeGang || hash % 7 === 4) results.push('괴강');

  if(results.length === 0) {
     const fallbacks = ['도화', '역마', '화개'];
     results.push(fallbacks[hash % 3]);
  }
  return Array.from(new Set(results)).slice(0, 3).map(key => SINSAL_DATA[key]);
};

const generateSajuProfile = (formData, flavorMode) => {
  const displayName = formData.name === '나(본인)' ? '회원' : formData.name;
  const hash = getHash(formData.name + formData.birthDate);
  const pillars = calculateRealSaju(formData.birthDate, formData.birthTime, formData.calendar);
  const primaryElem = pillars.day.stem.element;    
  const secondaryElem = pillars.month.branch.element; 

  const elemCounts = countElements(pillars);
  const elementsList = ['wood', 'fire', 'earth', 'metal', 'water'];
  const totalCount = Object.values(elemCounts).reduce((a, b) => a + b, 0);
  
  const lackElems = elementsList.filter(e => elemCounts[e] === 0);
  const excessElems = elementsList.filter(e => elemCounts[e] >= 3);
  
  const neededElem = getNeededElement(elemCounts, primaryElem);

  const overallPoints = [ { title: `${ELEMENTS[primaryElem].name}의 핵심 성향`, desc: ELEMENT_TRAITS[primaryElem].desc[flavorMode] } ];
  
  if (primaryElem !== secondaryElem) {
    overallPoints.push({ title: `${ELEMENTS[secondaryElem].name}의 보조 성향`, desc: ELEMENT_TRAITS[secondaryElem].desc[flavorMode] });
    overallPoints.push({ title: "종합적인 시너지", desc: flavorMode === 'spicy' ? "이 두 기운이 충돌하여 가끔 속을 알 수 없는 변덕쟁이 취급을 받습니다." : "이 두 가지 기운이 결합되어 주변 사람들에게 신뢰감 있고 매력적인 인상을 줍니다." });
  } else {
    overallPoints.push({ title: "강력한 단일 기운의 집중", desc: flavorMode === 'spicy' ? `특정 기운(${ELEMENTS[primaryElem].name})이 쓸데없이 강해서 융통성이 바닥을 치는 고집불통입니다.` : `특정 기운(${ELEMENTS[primaryElem].name})이 매우 강하게 발달하여 성향이 아주 뚜렷하고 특정 분야에서의 돌파력이 뛰어납니다.` });
  }

  const luckyReason = {
    mild: `사주에서 가장 필요한 기운인 '${ELEMENTS[neededElem].name}'을 채워 일상을 긍정적으로 변화시키는 맞춤형 행운 가이드입니다.`,
    spicy: `당신 사주의 치명적인 결함을 때우기 위한 응급 처방전입니다. 이 '${ELEMENTS[neededElem].name}' 기운의 소품을 볼 때마다 제발 정신 차리고 본인 똥고집 좀 꺾으라고 팩트 폭력 부적처럼 지니세요.`
  };

  return {
    pillars,
    profile: {
      sinsal: calculateSinsal(pillars, hash),
      overall: {
        title: primaryElem !== secondaryElem 
          ? `${ELEMENTS[primaryElem].name}과 ${ELEMENTS[secondaryElem].name}의 기운이 돋보이는 사주`
          : `강렬한 ${ELEMENTS[primaryElem].name}의 기운을 품고 태어난 사주`,
        description: flavorMode === 'spicy' 
          ? `${displayName}님의 사주는 아주 특징이 지독하게 뚜렷합니다. 남의 조언을 듣기보다 본인의 '${ELEMENT_TRAITS[primaryElem].keyword}' 기질을 무조건 밀어붙이는 아집을 경계해야 합니다.`
          : `${displayName}님의 사주는 아주 특징이 뚜렷합니다. 단순히 운에 기대기보다, '${ELEMENT_TRAITS[primaryElem].keyword}'을(를) 무기로 스스로 성취를 이루고 싶은 분입니다.`,
        points: overallPoints
      },
      elemDistribution: {
        counts: elemCounts,
        total: totalCount,
        lacks: lackElems.map(e => ({ name: ELEMENTS[e].name, desc: ELEMENT_ANALYSIS[e].lack[flavorMode], color: ELEMENTS[e].color, bg: ELEMENTS[e].bg })),
        excesses: excessElems.map(e => ({ name: ELEMENTS[e].name, desc: ELEMENT_ANALYSIS[e].excess[flavorMode], color: ELEMENTS[e].color, bg: ELEMENTS[e].bg })),
        balancedMsg: lackElems.length === 0 && excessElems.length === 0 ? "특정 기운에 치우치지 않고 오행이 골고루 잘 갖춰진, 안정적이고 원만한 사주 구조입니다." : null
      },
      personality: {
        strengths: Array.from(new Set([ ELEMENT_TRAITS[primaryElem].strength, ELEMENT_TRAITS[secondaryElem].strength, "주어진 역할에 대한 묵직한 책임감", "위기 상황에서 번뜩이는 대처 능력" ])),
        weaknesses: Array.from(new Set([ ELEMENT_TRAITS[primaryElem].weakness[flavorMode], ELEMENT_TRAITS[secondaryElem].weakness[flavorMode], flavorMode === 'spicy' ? "아프면 남 탓, 잘되면 내 탓하는 자기합리화" : "쉬어야 할 때도 계속 밀어붙이는 워커홀릭 경향", flavorMode === 'spicy' ? "가까운 사람일수록 함부로 대해서 상처를 줌" : "가까운 사람에게 애정 표현이 서툰 점" ]))
      },
      daeun: generateDaeunFlow(pillars, formData.gender, formData.birthDate), 
      luckySolution: {
        elementName: ELEMENTS[neededElem].name,
        color: ELEMENTS[neededElem].color,
        bg: ELEMENTS[neededElem].bg,
        data: LUCKY_SOLUTIONS[neededElem],
        reason: luckyReason[flavorMode]
      },
      career: CAREER_TRAITS[primaryElem],
      wealth: {
        overview: WEALTH_TRAITS[primaryElem].overview,
        good: WEALTH_TRAITS[primaryElem].good,
        bad: WEALTH_TRAITS[primaryElem].bad[flavorMode]
      },
      relationship: {
        overview: REL_TRAITS[primaryElem].overview,
        spouse: REL_TRAITS[primaryElem].spouse,
        tips: REL_TRAITS[primaryElem].tips[flavorMode]
      },
      children: CHILDREN_TRAITS[primaryElem],
      health: {
        overview: HEALTH_TRAITS[primaryElem].overview[flavorMode],
        points: HEALTH_TRAITS[primaryElem].points[flavorMode]
      },
      yearly: YEARLY_POOLS[hash % 2]
    }
  };
};

const generateDailyProfile = (formData, flavorMode) => {
  const hash = getHash(formData.name + formData.birthDate + new Date().toDateString());
  const pillars = calculateRealSaju(formData.birthDate, formData.birthTime, formData.calendar);
  const primaryElem = pillars.day.stem.element;
  
  const todayDate = new Date();
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
  const todayPillars = calculateRealSaju(todayStr, 'unknown', 'solar');
  const todayElem = todayPillars.day.stem.element;
  
  const deity = getTenDeity(primaryElem, todayElem);
  const scoreBase = 70 + (hash % 20);
  
  const selectedType = DAILY_FORTUNES[deity.id];
  const items = ["네이비 (Navy)", "버건디 (Burgundy)", "올리브 그린 (Olive)", "차분한 브라운 (Brown)", "화이트 (White)", "블랙 (Black)"];
  const numbers = ["3, 7", "2, 8", "1, 9", "4, 6", "0, 5"];
  const luckyObjs = ["따뜻한 차 한 잔", "아끼는 만년필/펜", "손수건", "좋아하는 향수", "작은 식물/화분", "거울"];

  return {
    total: { title: selectedType.title[flavorMode], desc: selectedType.desc[flavorMode] },
    scores: { love: Math.min(98, scoreBase + (hash % 5)), wealth: Math.min(98, scoreBase + ((hash + 2) % 6)), health: Math.min(98, scoreBase + ((hash + 4) % 7)) },
    timeFlow: [
      { time: "오전 (06:00~12:00)", icon: Sunrise, color: "text-amber-400", bgIcon: "bg-amber-500/20", borderColor: "border-amber-500/30", desc: flavorMode === 'spicy' ? "머리 회전이 가장 잘 될 때입니다. 미루지 말고 딴짓 없이 제일 중요한 일부터 쳐내세요." : "머리가 맑고 판단력이 좋아집니다. 중요한 결정이나 연락은 오전에 집중해서 처리하는 것이 좋습니다." },
      { time: "오후 (12:00~18:00)", icon: Sun, color: "text-rose-400", bgIcon: "bg-rose-500/20", borderColor: "border-rose-500/30", desc: flavorMode === 'spicy' ? "남들 신경 긁기 딱 좋은 시간입니다. 쓸데없는 논쟁 피하고 그냥 입 닫고 하던 일이나 마저 하세요." : "주변 사람들과의 교류가 활발하게 일어납니다. 조급해하지 말고 상대방의 말에 귀를 기울여주세요." },
      { time: "저녁 (18:00 이후)", icon: Moon, color: "text-indigo-400", bgIcon: "bg-indigo-500/20", borderColor: "border-indigo-500/30", desc: flavorMode === 'spicy' ? "더 이상 일 벌이지 마세요. 야식 시키지 말고 양치하고 일찍 자는 게 오늘 하루를 망치지 않는 지름길입니다." : "긴장이 풀리고 마음이 안정되는 시간입니다. 오늘 하루를 돌아보며 나를 위한 따뜻한 휴식을 가져보세요." }
    ],
    luckyItems: [
      { label: "행운의 색상", value: items[hash % items.length], icon: Palette, color: "text-blue-400", bg: "bg-blue-500/10" },
      { label: "행운의 숫자", value: numbers[hash % numbers.length], icon: Hash, color: "text-amber-400", bg: "bg-amber-500/10" },
      { label: "행운의 물건", value: luckyObjs[hash % luckyObjs.length], icon: Coffee, color: "text-rose-400", bg: "bg-rose-500/10" },
      { label: "오늘의 길방", value: (hash%2===0)?"남동쪽 (South-East)":"북서쪽 (North-West)", icon: Compass, color: "text-emerald-400", bg: "bg-emerald-500/10" }
    ],
    doAndDont: {
      do: flavorMode === 'spicy' ? ["가만히 있지 말고 제발 뭐라도 실행하기", "과거 후회 그만하고 지금 할 일에 집중하기"] : ["가벼운 산책으로 환기하기", "주변을 깨끗하게 정리정돈 하기"],
      dont: flavorMode === 'spicy' ? ["아는 척하면서 남 가르치려 들기", "불리해지면 핑계 대고 남 탓하기"] : ["불확실한 정보로 성급하게 판단하기", "감정에 휩쓸려 충동적으로 결정하기"]
    },
    relationship: {
      good: { title: "오늘의 귀인", desc: flavorMode === 'spicy' ? "나의 헛소리에 팩트 폭력을 날려줄 냉정한 현실주의자를 곁에 두세요." : "나의 이야기에 공감해주고 객관적인 조언을 건네는 사람과 대화하면 큰 위안을 얻습니다." },
      bad: { title: "주의할 인연", desc: flavorMode === 'spicy' ? "같이 뒷담화 까면서 내 에너지까지 갉아먹는 불평불만러를 절대 피하세요." : "본인의 감정만 앞세워 내 기운을 빼앗는 사람과는 적절한 거리를 유지하는 것이 좋습니다." }
    }
  };
};

const generateMatchProfile = (myFormData, partnerFormData, flavorMode) => {
  const myName = myFormData.name === '나(본인)' ? '나' : myFormData.name;
  const partnerName = partnerFormData.name === '나(본인)' ? '상대방' : partnerFormData.name;
  
  const hashMy = getHash(myFormData.name + myFormData.birthDate);
  const hashPartner = getHash(partnerFormData.name + partnerFormData.birthDate);
  const combinedHash = hashMy + hashPartner;

  const myPillars = calculateRealSaju(myFormData.birthDate, myFormData.birthTime, myFormData.calendar);
  const partnerPillars = calculateRealSaju(partnerFormData.birthDate, partnerFormData.birthTime, partnerFormData.calendar);

  const myElem = myPillars.day.stem.element;
  const partElem = partnerPillars.day.stem.element;
  
  const relation = getTenDeity(myElem, partElem);
  const matchData = MATCH_RELATIONS[relation.id];

  const baseScore = relation.id === 'same' ? 82 : (relation.id === 'produce' || relation.id === 'produced') ? 88 : 74;
  const matchScore = Math.min(99, baseScore + (combinedHash % 12)); 
  const compRate = Math.min(98, (relation.id === 'produce' || relation.id === 'produced' ? 85 : 65) + (combinedHash % 15));

  const elementDesc = matchData.element_match
    .replace('{my}', ELEMENTS[myElem].name)
    .replace('{part}', ELEMENTS[partElem].name);

  return {
    myPillars,
    partnerPillars,
    profile: {
      score: matchScore,
      title: matchData.title,
      summary: flavorMode === 'spicy' 
        ? `${myName}님과 ${partnerName}님은 [${relation.name}]의 굴레로 엮여있습니다. 이 기운의 장단점을 똑바로 파악하지 않으면 서로에게 깊은 상처만 남기는 피곤한 사이가 됩니다.`
        : `${myName}님과 ${partnerName}님은 [${relation.name}]의 관계로 묶여있습니다. 서로 주고받는 기운이 또렷하여 시간이 지날수록 서로에게 깊은 영향을 주는 사이입니다.`,
      keywords: ["십성분석", relation.name.replace(/[^가-힣]/g, ''), matchScore > 85 ? "상생의인연" : "자극과성장"],
      element_match: {
        title: `${ELEMENTS[myElem].name}과(와) ${ELEMENTS[partElem].name}의 만남`,
        desc: elementDesc
      },
      complement_rate: {
        score: compRate,
        desc: relation.id === 'same' ? "비슷한 성향이 시너지를 내지만 약점도 함께 공유하므로, 서로를 객관적으로 봐주는 노력이 필요합니다." : 
              (relation.id === 'produce' || relation.id === 'produced') ? "한 사람이 품어주고 한 사람이 채워주는 이상적인 오행 보완 관계입니다. 서로를 통해 큰 정서적 안정을 찾습니다." : 
              "서로 다른 점에 강하게 끌리며 결핍된 요소를 자극해주는 매력적인 관계입니다. 다름을 인정할 때 텐션과 시너지가 가장 크게 발생합니다."
      },
      details: [
        { category: "연인/부부 궁합", icon: Heart, score: matchScore + (combinedHash % 3) > 99 ? 99 : matchScore + (combinedHash % 3), color: "text-rose-400", bg: "bg-rose-950/30", desc: matchData.chemistry },
        { category: "재물/동업 궁합", icon: Coins, score: Math.max(60, matchScore - 5 + (combinedHash % 7)), color: "text-amber-400", bg: "bg-amber-950/30", desc: relation.id === 'control' || relation.id === 'controlled' ? "비즈니스에서는 감정을 빼고 철저하게 각자의 역할을 나누면 최고의 성과를 낼 수 있는 긴장감 있고 생산적인 파트너입니다." : "서로 합심하여 공동의 금전 목표를 세울 때 달성 속도가 배가 되는 긍정적이고 조화로운 동업 운을 가졌습니다." }
      ],
      conflict_resolution: {
         my_trait: ELEMENT_TRAITS[myElem].keyword + " 중심 성향",
         partner_trait: ELEMENT_TRAITS[partElem].keyword + " 중심 성향",
         solution: matchData.conflict[flavorMode]
      },
      secret_chemistry: {
         title: "서로에게 미치는 보이지 않는 영향력",
         desc: matchData.chemistry
      },
      best_timing: MATCH_TIMING[combinedHash % MATCH_TIMING.length],
      advice: matchData.advice[flavorMode],
      final_verdict: matchData.final_verdict[flavorMode]
    }
  };
};

const PillarBox = ({ title, data, isUnknown }) => {
  if (isUnknown) return (
    <div className="flex flex-col items-center flex-1">
      <div className="text-[10px] sm:text-xs text-slate-400 font-medium mb-1">{title}</div>
      <div className="w-full bg-slate-800 border border-slate-700/50 rounded-lg sm:rounded-xl p-2 flex flex-col items-center justify-center gap-1 sm:gap-2 h-24 sm:h-28 shadow-sm">
        <span className="text-xl sm:text-2xl text-slate-500 leading-none font-serif">?</span><div className="w-full border-t border-slate-700/50 my-0.5"></div><span className="text-xl sm:text-2xl text-slate-500 leading-none font-serif">?</span>
      </div>
    </div>
  );
  const { stem, branch } = data;
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="text-[10px] sm:text-xs text-slate-400 font-medium mb-1">{title}</div>
      <div className="w-full rounded-lg sm:rounded-xl overflow-hidden flex flex-col h-24 sm:h-28 shadow-sm border border-slate-700/30">
        <div className={`flex-1 flex flex-col items-center justify-center ${ELEMENTS[stem.element].bg} border-b ${ELEMENTS[stem.element].border}`}>
          <span className={`text-xl sm:text-2xl font-serif font-bold leading-none mb-0.5 ${ELEMENTS[stem.element].color}`}>{stem.char}</span>
          <span className="text-[8px] sm:text-[10px] text-slate-300/80 font-medium leading-none">{stem.kor}</span>
        </div>
        <div className={`flex-1 flex flex-col items-center justify-center ${ELEMENTS[branch.element].bg}`}>
          <span className={`text-xl sm:text-2xl font-serif font-bold leading-none mb-0.5 ${ELEMENTS[branch.element].color}`}>{branch.char}</span>
          <span className="text-[8px] sm:text-[10px] text-slate-300/80 font-medium leading-none">{branch.kor}</span>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle, flavorMode }) => (
  <div className="mb-4 relative z-10 flex items-center justify-between">
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className={`p-2 rounded-lg border ${flavorMode === 'spicy' ? 'bg-rose-500/20 border-rose-500/20' : 'bg-indigo-500/20 border-indigo-500/20'}`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-indigo-400'}`} />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
      </div>
      {subtitle && <p className="text-xs sm:text-sm text-slate-400 ml-10 sm:ml-12">{subtitle}</p>}
    </div>
  </div>
);

const BulletList = ({ items, type = "dot" }) => (
  <ul className="space-y-2 relative z-10">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {type === 'check' && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 mt-0.5 shrink-0" />}
        {type === 'warn' && <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 mt-0.5 shrink-0" />}
        {type === 'dot' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />}
        {type === 'star' && <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 mt-0.5 shrink-0" />}
        <span className="font-medium text-slate-200">{item}</span>
      </li>
    ))}
  </ul>
);

// 🔥 신규 추가: 오행 레이더 차트 컴포넌트
const ElementRadarChart = ({ counts }) => {
  const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
  const maxVal = Math.max(4, ...Object.values(counts));
  const cx = 100, cy = 100, R = 70;
  const angles = [-90, -18, 54, 126, 198].map(deg => deg * Math.PI / 180);

  const getPt = (val, i) => `${cx + (val / maxVal) * R * Math.cos(angles[i])},${cy + (val / maxVal) * R * Math.sin(angles[i])}`;

  const dataPoints = elements.map((e, i) => getPt(counts[e], i)).join(' ');
  const gridLevels = [0.25, 0.5, 0.75, 1].map(level => elements.map((e, i) => getPt(maxVal * level, i)).join(' '));

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto mt-4 mb-6">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-xl">
        {gridLevels.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="#334155" strokeWidth={i === 3 ? "1" : "0.5"} strokeDasharray={i === 3 ? "none" : "3 3"} />
        ))}
        {elements.map((e, i) => (
          <line key={`axis-${e}`} x1={cx} y1={cy} x2={cx + R * Math.cos(angles[i])} y2={cy + R * Math.sin(angles[i])} stroke="#334155" strokeWidth="1" />
        ))}
        <polygon points={dataPoints} fill="rgba(99, 102, 241, 0.3)" stroke="#818cf8" strokeWidth="2" className="transition-all duration-1000 ease-out" />
        {elements.map((e, i) => {
          const [px, py] = getPt(counts[e], i).split(',');
          return <circle key={`pt-${e}`} cx={px} cy={py} r="4" fill="#c7d2fe" />
        })}
        {elements.map((e, i) => {
          const lx = cx + (R + 25) * Math.cos(angles[i]);
          const ly = cy + (R + 25) * Math.sin(angles[i]) + 4;
          return (
            <text key={`label-${e}`} x={lx} y={ly} textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" className={ELEMENTS[e].color}>
              {ELEMENTS[e].name.slice(0, 2)} ({counts[e]})
            </text>
          )
        })}
      </svg>
    </div>
  );
};

const ProfileSelector = ({ savedProfiles, onSelect }) => {
  if (!savedProfiles || savedProfiles.length === 0) return null;
  return (
    <div className="mb-6">
      <label className="block text-xs text-slate-400 font-bold mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> 저장된 인연 불러오기</label>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {savedProfiles.map(p => (
          <button key={p.id} type="button" onClick={() => onSelect(p)} className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-indigo-600 border border-slate-500 hover:border-indigo-400 rounded-full transition-all group shadow-sm">
            <div className={`w-2 h-2 rounded-full ${p.gender === 'male' ? 'bg-blue-400' : 'bg-rose-400'}`}></div>
            <span className="text-sm font-bold text-slate-100 group-hover:text-white">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const FlavorToggle = ({ flavorMode, setFlavorMode }) => (
  <div className="flex items-center justify-center gap-3 mb-6 bg-slate-800/80 p-2 rounded-2xl border border-slate-700 w-full shadow-inner">
    <button type="button" onClick={() => setFlavorMode('mild')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${flavorMode === 'mild' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
      <span className="text-lg">😌</span> 순한맛 (위로·조언)
    </button>
    <button type="button" onClick={() => setFlavorMode('spicy')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${flavorMode === 'spicy' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}>
      <span className="text-lg">🔥</span> 매운맛 (뼈때리는 팩폭)
    </button>
  </div>
);

export default function SajuApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 
  const [savedProfiles, setSavedProfiles] = useState([]);
  
  const [flavorMode, setFlavorMode] = useState('mild');

  const [formData, setFormData] = useState({ name: '', gender: 'male', calendar: 'solar', birthDate: '', birthTime: 'unknown' });
  const [partnerFormData, setPartnerFormData] = useState({ name: '', gender: 'female', calendar: 'solar', birthDate: '', birthTime: 'unknown' });
  
  const [sajuStep, setSajuStep] = useState('input'); 
  const [sajuResult, setSajuResult] = useState(null);
  
  const [matchStep, setMatchStep] = useState('input');
  const [matchResult, setMatchResult] = useState(null);

  const [dailyStep, setDailyStep] = useState('input');
  const [dailyResult, setDailyResult] = useState(null);
  
  const [isPrinting, setIsPrinting] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', gender: 'male', calendar: 'solar', birthDate: '', birthTime: 'unknown' });

  useEffect(() => {
    const auth = localStorage.getItem('sajuLogAuth');
    if (auth) setIsLoggedIn(true);
    const profiles = localStorage.getItem('sajuLogProfiles');
    if (profiles) setSavedProfiles(JSON.parse(profiles));
  }, []);

  const handleLogin = (provider) => {
    setIsLoggedIn(true);
    localStorage.setItem('sajuLogAuth', 'true');
    const profiles = localStorage.getItem('sajuLogProfiles');
    if (!profiles) {
      const demoProfile = { id: Date.now(), name: '나(본인)', gender: 'male', calendar: 'solar', birthDate: '1990-01-01', birthTime: 'unknown', isMe: true };
      setSavedProfiles([demoProfile]);
      localStorage.setItem('sajuLogProfiles', JSON.stringify([demoProfile]));
    }
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('sajuLogAuth');
    setActiveTab('home');
  };

  const handleAddProfile = (newProfile) => {
    const updated = [...savedProfiles, { ...newProfile, id: Date.now() }];
    setSavedProfiles(updated);
    localStorage.setItem('sajuLogProfiles', JSON.stringify(updated));
    alert(`${newProfile.name}님의 정보가 인연 도감에 저장되었습니다.`);
  };

  const handleDeleteProfile = (id) => {
    if(window.confirm('이 프로필을 삭제하시겠습니까?')) {
      const updated = savedProfiles.filter(p => p.id !== id);
      setSavedProfiles(updated);
      localStorage.setItem('sajuLogProfiles', JSON.stringify(updated));
    }
  };

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePartnerInputChange = (e) => setPartnerFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) return alert("이름과 생년월일을 입력해주세요.");
    setSajuStep('loading');
    setTimeout(() => { 
      setSajuResult(generateSajuProfile(formData, flavorMode)); 
      setSajuStep('result'); 
    }, 1500);
  };

  const handleAnalyzeMatch = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) return alert("나의 이름과 생년월일을 입력해주세요.");
    if (!partnerFormData.name || !partnerFormData.birthDate) return alert("상대방의 이름과 생년월일을 입력해주세요.");
    setMatchStep('loading');
    setTimeout(() => { 
      setMatchResult(generateMatchProfile(formData, partnerFormData, flavorMode)); 
      setMatchStep('result'); 
    }, 2000);
  };

  const handleAnalyzeDaily = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) return alert("이름과 생년월일을 입력해주세요.");
    setDailyStep('loading');
    setTimeout(() => { 
      setDailyResult(generateDailyProfile(formData, flavorMode));
      setDailyStep('result'); 
    }, 1500);
  };

  const handleDownloadImage = async () => {
    if (isPrinting) return;
    setIsPrinting(true);
    
    const originalScrollY = window.scrollY;
    window.scrollTo(0, 0); 
    
    try {
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const element = document.querySelector('.print-container');
      const wrapper = document.createElement('div');
      
      wrapper.style.position = 'absolute';
      wrapper.style.top = '0';
      wrapper.style.left = '0';
      wrapper.style.width = '768px'; 
      wrapper.style.backgroundColor = '#0A0D14'; 
      wrapper.style.zIndex = '-9999'; 
      wrapper.style.padding = '40px'; 
      wrapper.style.boxSizing = 'border-box';

      const clone = element.cloneNode(true);
      clone.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
      clone.classList.add('image-export-mode'); 
      
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await window.html2canvas(wrapper, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#0A0D14', 
        logging: false,
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
        windowWidth: 768,
        scrollY: 0,
        scrollX: 0,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('.image-export-mode');
          if(el) { el.style.opacity = '1'; el.style.visibility = 'visible'; }
        }
      });

      const myName = formData.name === '나(본인)' ? '나' : formData.name;
      const partnerName = partnerFormData.name === '나(본인)' ? '상대방' : partnerFormData.name;

      const filenameMode = flavorMode === 'spicy' ? '_팩폭버전' : '';
      const filename = activeTab === 'match' 
        ? `${myName}_${partnerName}_프리미엄_궁합분석${filenameMode}.png`
        : activeTab === 'daily'
        ? `${myName}_오늘의운세${filenameMode}.png`
        : `${myName}_프리미엄_사주분석${filenameMode}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      document.body.removeChild(wrapper);
    } catch (error) {
      console.error("이미지 다운로드 중 오류:", error);
      alert("이미지 렌더링 중 문제가 발생했습니다.");
    } finally {
      window.scrollTo(0, originalScrollY); 
      setIsPrinting(false);
    }
  };

  const renderHomeTab = () => (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up mt-4 sm:mt-8 pb-32">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10"><Sunrise className="w-48 h-48" /></div>
        <div className="relative z-10">
          <span className="text-indigo-400 font-bold text-xs bg-indigo-500/20 px-3 py-1 rounded-full mb-4 inline-block border border-indigo-500/30">PREMIUM DASHBOARD</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">반갑습니다, 회원님!</h2>
          <p className="text-slate-300 text-sm font-medium">오늘 하루도 사주로그와 함께 행운을 만들어가세요.</p>
        </div>
      </div>

      <h3 className="text-white font-bold text-lg px-2 flex items-center gap-2"><Compass className="w-5 h-5 text-amber-500" /> 맞춤 운세 바로가기</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => { setActiveTab('daily'); setDailyStep('input'); window.scrollTo(0,0); }} className="bg-slate-800 hover:bg-slate-700/80 p-5 rounded-2xl border border-slate-700 transition-all text-left flex flex-col h-full group">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 border border-amber-500/30 group-hover:scale-110 transition-transform"><Sun className="w-6 h-6 text-amber-400" /></div>
          <h4 className="text-white font-bold text-lg mb-1">오늘의 운세</h4>
          <p className="text-slate-400 text-xs leading-relaxed">매일 아침 업데이트되는<br/>나만의 하루 바이오리듬</p>
        </button>
        <button onClick={() => { setActiveTab('saju'); setSajuStep('input'); window.scrollTo(0,0); }} className="bg-slate-800 hover:bg-slate-700/80 p-5 rounded-2xl border border-slate-700 transition-all text-left flex flex-col h-full group">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30 group-hover:scale-110 transition-transform"><BookOpen className="w-6 h-6 text-indigo-400" /></div>
          <h4 className="text-white font-bold text-lg mb-1">프리미엄 사주</h4>
          <p className="text-slate-400 text-xs leading-relaxed">전문가의 시선으로 풀어낸<br/>내 인생의 10년 주기 대운</p>
        </button>
        <button onClick={() => { setActiveTab('match'); setMatchStep('input'); window.scrollTo(0,0); }} className="bg-slate-800 hover:bg-slate-700/80 p-5 rounded-2xl border border-slate-700 transition-all text-left flex flex-col h-full group">
          <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center mb-4 border border-rose-500/30 group-hover:scale-110 transition-transform"><Heart className="w-6 h-6 text-rose-400" /></div>
          <h4 className="text-white font-bold text-lg mb-1">프리미엄 궁합</h4>
          <p className="text-slate-400 text-xs leading-relaxed">서로의 결핍을 채워주는<br/>오행 상생 심층 분석</p>
        </button>
      </div>

      <div className="bg-[#4c0519]/50 p-6 rounded-3xl border border-rose-900/50 mt-6 flex items-start gap-4">
         <div className="p-3 bg-rose-900/50 rounded-xl shrink-0"><Flame className="w-6 h-6 text-rose-400" /></div>
         <div>
           <h4 className="text-rose-400 font-bold mb-1">[NEW] 매운맛(팩폭) 모드 업데이트!</h4>
           <p className="text-slate-300 text-sm leading-relaxed">운세를 볼 때 <b className="text-white">'매운맛'</b>을 선택하면, 눈물 쏙 빠지게 뼈 때리는 직설적인 팩트 폭력 조언을 들을 수 있습니다. 마음의 준비를 하고 도전해 보세요!</p>
         </div>
      </div>
    </div>
  );

  const renderMyPageTab = () => {
    const handleOpenAdd = () => {
      setEditId(null);
      setProfileForm({ name: '', gender: 'male', calendar: 'solar', birthDate: '', birthTime: 'unknown' });
      setIsFormOpen(true);
    };

    const handleOpenEdit = (p) => {
      setEditId(p.id);
      setProfileForm(p);
      setIsFormOpen(true);
    };

    const handleSaveProfile = (e) => {
      e.preventDefault();
      if(!profileForm.name || !profileForm.birthDate) return alert("이름과 생년월일을 입력해주세요.");
      
      if (editId) {
        const updated = savedProfiles.map(p => p.id === editId ? { ...profileForm, id: editId } : p);
        setSavedProfiles(updated);
        localStorage.setItem('sajuLogProfiles', JSON.stringify(updated));
        alert('정보가 성공적으로 수정되었습니다.');
      } else {
        handleAddProfile(profileForm);
      }
      setIsFormOpen(false);
    };

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up mt-4 sm:mt-8 pb-32">
        <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><UserCircle className="w-6 h-6 text-purple-400"/> 내 인연 도감</h2>
            <p className="text-sm text-slate-400 font-medium">나와 소중한 사람들의 정보를 저장하고 관리하세요.</p>
          </div>
          <button onClick={handleLogout} className="px-3 py-1.5 bg-slate-800 text-xs text-slate-400 rounded-lg hover:text-white transition-colors border border-slate-700 flex items-center gap-1.5">
            로그아웃
          </button>
        </div>

        {isFormOpen ? (
          <div className="bg-slate-800 p-6 rounded-2xl border border-purple-500/50 shadow-lg animate-fade-in-up">
            <h3 className="text-lg font-bold text-white mb-4">{editId ? '인연 정보 수정하기' : '새로운 인연 추가하기'}</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1"><label className="block text-xs text-slate-400 font-medium mb-1">이름</label><input type="text" name="name" value={profileForm.name} onChange={(e)=>setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm" required /></div>
                <div className="w-20 shrink-0"><label className="block text-xs text-slate-400 font-medium mb-1">성별</label>
                  <select name="gender" value={profileForm.gender} onChange={(e)=>setProfileForm({...profileForm, gender: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm text-center">
                    <option value="male">남성</option><option value="female">여성</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-xs text-slate-400 font-medium">생년월일</label>
                  <div className="flex bg-slate-900 rounded-md p-0.5 border border-slate-700">
                    <button type="button" onClick={() => setProfileForm({...profileForm, calendar: 'solar'})} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${profileForm.calendar === 'solar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>양력</button>
                    <button type="button" onClick={() => setProfileForm({...profileForm, calendar: 'lunar'})} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${profileForm.calendar === 'lunar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>음력</button>
                  </div>
                </div>
                <input type="date" name="birthDate" value={profileForm.birthDate} onChange={(e)=>setProfileForm({...profileForm, birthDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none [&::-webkit-calendar-picker-indicator]:invert text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">태어난 시간</label>
                <select name="birthTime" value={profileForm.birthTime} onChange={(e)=>setProfileForm({...profileForm, birthTime: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                  <option value="unknown">모름 (시간 제외)</option>
                  <option value="00:00">자시 (23:30 ~ 01:29)</option><option value="02:00">축시 (01:30 ~ 03:29)</option><option value="04:00">인시 (03:30 ~ 05:29)</option>
                  <option value="06:00">묘시 (05:30 ~ 07:29)</option><option value="08:00">진시 (07:30 ~ 09:29)</option><option value="10:00">사시 (09:30 ~ 11:29)</option>
                  <option value="12:00">오시 (11:30 ~ 13:29)</option><option value="14:00">미시 (13:30 ~ 15:29)</option><option value="16:00">신시 (15:30 ~ 17:29)</option>
                  <option value="18:00">유시 (17:30 ~ 19:29)</option><option value="20:00">술시 (19:30 ~ 21:29)</option><option value="22:00">해시 (21:30 ~ 23:29)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                 <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-[0_4px_15px_rgba(147,51,234,0.4)] transition-all border border-purple-500 text-sm">저장하기</button>
                 <button type="button" onClick={()=>setIsFormOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all border border-slate-500 shadow-sm text-sm">취소</button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={handleOpenAdd} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-500 text-slate-200 hover:text-white p-4 rounded-2xl flex items-center justify-center gap-2 transition-colors font-bold shadow-sm">
            <Plus className="w-5 h-5" /> 새 인연 등록하기
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedProfiles.map(p => (
            <div key={p.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${p.gender === 'male' ? 'bg-blue-900/50 text-blue-400 border border-blue-500/30' : 'bg-rose-900/50 text-rose-400 border border-rose-500/30'}`}>
                   {p.name[0]}
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                      {p.name}
                      {(p.isMe || p.name === '나(본인)') && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">내 사주</span>}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {p.birthDate} ({p.calendar === 'solar' ? '양' : '음'})</p>
                 </div>
              </div>
              <div className="flex items-center gap-1">
                 <button onClick={() => handleOpenEdit(p)} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="수정">
                    <Edit2 className="w-5 h-5" />
                 </button>
                 {!(p.isMe || p.name === '나(본인)') && (
                   <button onClick={() => handleDeleteProfile(p.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="삭제">
                      <Trash2 className="w-5 h-5" />
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSajuTab = () => {
    if (sajuStep === 'input') return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/50 mt-4 sm:mt-10 mb-32 pb-6 shadow-xl animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-4 border border-amber-500/30 shadow-sm">
            <BookOpen className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-serif tracking-tight">프리미엄 사주 분석</h1>
          <p className="text-slate-400 text-sm">전문가의 관점으로 깊이 있게 풀이해 드립니다.</p>
        </div>
        
        <FlavorToggle flavorMode={flavorMode} setFlavorMode={setFlavorMode} />

        <ProfileSelector savedProfiles={savedProfiles} onSelect={(p) => setFormData({...p})} />

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1"><label className="block text-sm text-slate-300 font-medium mb-1">이름</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" required /></div>
            <div className="w-24 shrink-0"><label className="block text-sm text-slate-300 font-medium mb-1">성별</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none transition-all text-center">
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm text-slate-300 font-medium">생년월일</label>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                <button type="button" onClick={() => setFormData(prev => ({...prev, calendar: 'solar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${formData.calendar === 'solar' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>양력</button>
                <button type="button" onClick={() => setFormData(prev => ({...prev, calendar: 'lunar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${formData.calendar === 'lunar' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>음력</button>
              </div>
            </div>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none [&::-webkit-calendar-picker-indicator]:invert transition-all" required />
          </div>
          <div>
            <label className="block text-sm text-slate-300 font-medium mb-1">태어난 시간</label>
            <select name="birthTime" value={formData.birthTime} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none transition-all">
              <option value="unknown">모름 (시간 제외 분석)</option>
              <option value="00:00">자시 (23:30 ~ 01:29)</option><option value="02:00">축시 (01:30 ~ 03:29)</option><option value="04:00">인시 (03:30 ~ 05:29)</option>
              <option value="06:00">묘시 (05:30 ~ 07:29)</option><option value="08:00">진시 (07:30 ~ 09:29)</option><option value="10:00">사시 (09:30 ~ 11:29)</option>
              <option value="12:00">오시 (11:30 ~ 13:29)</option><option value="14:00">미시 (13:30 ~ 15:29)</option><option value="16:00">신시 (15:30 ~ 17:29)</option>
              <option value="18:00">유시 (17:30 ~ 19:29)</option><option value="20:00">술시 (19:30 ~ 21:29)</option><option value="22:00">해시 (21:30 ~ 23:29)</option>
            </select>
          </div>
          <button type="submit" className={`w-full mt-6 text-white font-bold py-4 rounded-xl transition-all border text-lg ${flavorMode === 'spicy' ? 'bg-rose-600 hover:bg-rose-500 border-rose-500 shadow-[0_4px_20px_rgba(225,29,72,0.4)]' : 'bg-amber-600 hover:bg-amber-500 border-amber-500 shadow-[0_4px_20px_rgba(217,119,6,0.4)]'}`}>
            {flavorMode === 'spicy' ? '🔥 팩폭 리포트 열람하기' : '프리미엄 리포트 열람하기'}
          </button>
        </form>
      </div>
    );

    if (sajuStep === 'loading') {
      const displayName = formData.name === '나(본인)' ? '회원' : formData.name;
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center mt-10">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mb-6 shadow-md"></div>
          <h2 className="text-xl font-bold text-white mb-2">{displayName}님의 명식을 심층 분석 중입니다...</h2>
          <p className="text-slate-400 text-sm">대운의 흐름과 오행 밸런스를 스캔하고 있습니다</p>
        </div>
      );
    }

    const { pillars, profile } = sajuResult;
    const displayName = formData.name === '나(본인)' ? '회원' : formData.name;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up mt-4 sm:mt-8 pb-12 print-container bg-[#0A0D14] text-slate-200">
        <div className="hidden export-header text-center mb-8 border-b border-slate-700 pb-6 pt-4">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">프리미엄 사주 분석 리포트 {flavorMode === 'spicy' && ' (팩폭 버전)'}</h1>
          <p className="text-slate-400 font-medium">발행일: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>

        {flavorMode === 'spicy' && (
          <div className="bg-rose-950 border-2 border-rose-500 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8 shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-pulse relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-20"><AlertTriangle className="w-24 h-24 text-rose-500" /></div>
            <div className="p-3 bg-rose-500 rounded-xl shrink-0 z-10"><AlertTriangle className="w-8 h-8 text-white" /></div>
            <div className="z-10 text-center sm:text-left">
              <h4 className="text-rose-400 font-black text-lg sm:text-xl mb-1 tracking-tight">🚨 멘탈 타격 주의보 (팩폭 모드 켜짐)</h4>
              <p className="text-sm text-rose-200 leading-relaxed font-medium">이 리포트는 위로와 포장을 완전히 걷어낸 <b className="text-white">극사실주의 직설 조언</b>입니다. 단점을 뼈아프게 찌르기 때문에 상처를 받을 수 있습니다. 감당하기 어렵다면 지금이라도 상단의 '순한맛' 버튼을 눌러주세요.</p>
            </div>
          </div>
        )}

        {/* 타이틀 영역 */}
        <div className={`pdf-solid-bg rounded-3xl p-6 sm:p-8 border text-center relative overflow-hidden shadow-sm bg-gradient-to-br ${flavorMode === 'spicy' ? 'from-[#4c0519]/50 to-[#1c1917] border-rose-500/30' : 'from-slate-900 to-[#1c1917] border-amber-500/30'}`}>
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><BookOpen className={`w-32 h-32 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-400'}`} /></div>
          <span className={`text-xs font-bold px-4 py-1.5 rounded-full border relative z-10 tracking-widest ${flavorMode === 'spicy' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
            PREMIUM SAJU REPORT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-5 mb-6 relative z-10">{displayName}님의 사주 분석서</h1>
          <div className="flex gap-2 sm:gap-4 justify-between bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 relative z-10 shadow-inner">
            <PillarBox title="년주(해)" data={pillars.year} /><PillarBox title="월주(달)" data={pillars.month} /><PillarBox title="일주(나)" data={pillars.day} /><PillarBox title="시주(시간)" data={pillars.hour} isUnknown={formData.birthTime==='unknown'} />
          </div>
        </div>

        {/* 1. 기본 성향 분석 */}
        <div className={`pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative ${flavorMode === 'spicy' && 'bg-[#4c0519]/10'}`}>
          <h2 className={`text-xl font-bold border-b border-slate-700 pb-4 mb-6 relative z-10 flex items-center gap-2 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-500'}`}>
             <div className={`p-1.5 rounded-md ${flavorMode === 'spicy' ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}><User className={`w-5 h-5 ${flavorMode === 'spicy' ? 'text-rose-500' : 'text-amber-500'}`}/></div>
             1. 타고난 명식의 구조와 성향
          </h2>
          <div className="space-y-8 relative z-10">
            <section>
              <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-sm">
                <p className="text-indigo-300 font-bold text-lg mb-3">"{profile.overall.title}"</p>
                <p className={`text-sm leading-relaxed mb-5 font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-200'}`}>{profile.overall.description}</p>
                <div className="space-y-3">
                  {profile.overall.points.map((p, i) => (
                    <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-700/50 shadow-sm">
                      <span className="font-bold text-white block mb-1 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400"/> {p.title}</span>
                      <span className={`text-sm leading-relaxed ${flavorMode === 'spicy' ? 'text-rose-300 font-medium' : 'text-slate-300'}`}>{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#022c22] rounded-2xl p-5 border border-emerald-900/50 shadow-sm">
                  <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> 강점</h4>
                  <BulletList items={profile.personality.strengths} type="check" />
                </div>
                <div className="bg-[#4c0519] rounded-2xl p-5 border border-rose-900/50 shadow-sm">
                  <h4 className="text-rose-400 font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> 치명적 단점</h4>
                  <BulletList items={profile.personality.weaknesses} type="warn" />
                </div>
            </section>
          </div>
        </div>

        {/* 2. 내 안에 숨겨진 특별한 기운 (신살) */}
        <div className={`pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative mt-6 ${flavorMode === 'spicy' ? 'bg-[#4c0519]/10' : ''}`}>
          <h2 className={`text-xl font-bold border-b border-slate-700 pb-4 mb-6 relative z-10 flex items-center gap-2 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-500'}`}>
            <div className={`p-1.5 rounded-md ${flavorMode === 'spicy' ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}><Sparkles className={`w-5 h-5 ${flavorMode === 'spicy' ? 'text-rose-500' : 'text-amber-500'}`}/></div>
            2. 내 안에 숨겨진 특별한 기운 (신살)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {profile.sinsal.map((s, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border bg-slate-800 ${s.border} shadow-sm relative overflow-hidden group`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl ${s.bg} border ${s.border}`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${s.color}`}>{s.name}</h4>
                    <p className="text-xs font-bold text-slate-400">"{s.keyword}"</p>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-200'}`}>
                  {s.desc[flavorMode]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 오행 밸런스 및 과다/무자 심층 분석 */}
        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-sm relative bg-slate-900 mt-6">
          <SectionHeader icon={PieChart} title="3. 오행 밸런스 및 개운(開運) 전략" subtitle="내 사주에 넘치는 기운과 부족한 기운" flavorMode={flavorMode} />
          
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 mb-6">
            <p className="text-xs text-slate-400 font-bold mb-2 text-center">현재 사주의 5원소 밸런스 레이더 (총 {profile.elemDistribution.total}글자)</p>
            <ElementRadarChart counts={profile.elemDistribution.counts} />
          </div>

          <div className="space-y-4">
             {profile.elemDistribution.balancedMsg && (
                <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30 flex gap-3 items-start">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                   <p className="text-sm text-emerald-200 leading-relaxed font-medium">{profile.elemDistribution.balancedMsg}</p>
                </div>
             )}
             {profile.elemDistribution.excesses.map((item, idx) => (
                <div key={`ex-${idx}`} className={`p-4 rounded-xl border ${item.bg.replace('950', '900/40')} border-opacity-50 flex gap-3 items-start shadow-sm`}>
                   <div className={`px-2 py-1 rounded text-[10px] font-bold ${item.color} bg-slate-900 border ${item.color.replace('text', 'border')}/30 shrink-0 mt-0.5`}>{item.name} 과다</div>
                   <p className={`text-sm leading-relaxed ${flavorMode === 'spicy' ? 'text-rose-200 font-medium' : 'text-slate-200'}`}>{item.desc}</p>
                </div>
             ))}
             {profile.elemDistribution.lacks.map((item, idx) => (
                <div key={`la-${idx}`} className={`p-4 rounded-xl border bg-slate-800 border-slate-700/80 flex gap-3 items-start shadow-sm`}>
                   <div className={`px-2 py-1 rounded text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-700 shrink-0 mt-0.5`}>{item.name} 부족</div>
                   <p className={`text-sm leading-relaxed ${flavorMode === 'spicy' ? 'text-rose-200 font-medium' : 'text-slate-200'}`}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>

        {/* 4. 직업과 재물의 흐름 */}
        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative mt-6">
          <h2 className="text-xl font-bold text-amber-500 border-b border-slate-700 pb-4 mb-6 relative z-10 flex items-center gap-2">
             <div className="p-1.5 bg-amber-500/10 rounded-md"><Coins className="w-5 h-5 text-amber-500"/></div>
             4. 직업과 재물의 흐름
          </h2>
          <div className="space-y-8 relative z-10">
            <section>
              <SectionHeader icon={Briefcase} title="직업 및 사업 적성" flavorMode={flavorMode} />
              <p className="text-slate-200 font-medium text-sm leading-relaxed mb-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">{profile.career.overview}</p>
              <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> 잘 맞는 업무 방향</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.career.suitable.map((job, i) => (
                  <div key={i} className="bg-[#1e1b4b] border border-indigo-900/50 p-3 rounded-xl text-sm text-indigo-300 font-medium text-center shadow-inner">{job}</div>
                ))}
              </div>
            </section>
            <section>
              <SectionHeader icon={Coins} title="재물운의 특성" flavorMode={flavorMode} />
              <p className="text-slate-200 font-medium text-sm leading-relaxed mb-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">{profile.wealth.overview}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-sm">
                  <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><span className="text-blue-400 font-bold text-lg">+</span> 유리한 구조</h4>
                  <BulletList items={profile.wealth.good} type="dot" />
                </div>
                <div className={`rounded-2xl p-5 border shadow-sm ${flavorMode === 'spicy' ? 'bg-[#4c0519]/40 border-rose-900/50' : 'bg-slate-800 border-slate-700'}`}>
                  <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><span className="text-rose-400 font-bold text-lg">-</span> 피해야 할 파멸의 습관</h4>
                  <BulletList items={profile.wealth.bad} type="warn" />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 5. 인연과 건강 관리 */}
        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative mt-6">
          <h2 className="text-xl font-bold text-amber-500 border-b border-slate-700 pb-4 mb-6 relative z-10 flex items-center gap-2">
             <div className="p-1.5 bg-amber-500/10 rounded-md"><Heart className="w-5 h-5 text-amber-500"/></div>
             5. 인연과 건강 관리
          </h2>
          <div className="space-y-8 relative z-10">
            <section>
              <SectionHeader icon={Heart} title="인간관계 및 배우자운" flavorMode={flavorMode} />
              <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 space-y-4 shadow-sm">
                <p className="text-sm text-slate-200 leading-relaxed"><span className="font-bold text-white mr-1">대인관계:</span> {profile.relationship.overview}</p>
                <div className="w-full border-t border-slate-700 my-2"></div>
                <p className="text-sm text-slate-200 leading-relaxed"><span className="font-bold text-white mr-1">배우자/연인:</span> {profile.relationship.spouse}</p>
                <div className={`p-4 rounded-xl mt-4 border shadow-inner ${flavorMode === 'spicy' ? 'bg-[#4c0519]/80 border-rose-500/50' : 'bg-[#4c0519] border-rose-900/50'}`}>
                  <h4 className={`text-xs font-bold mb-2 ${flavorMode === 'spicy' ? 'text-rose-300' : 'text-rose-400'}`}>관계 파탄을 막는 조언</h4>
                  <BulletList items={profile.relationship.tips} type={flavorMode === 'spicy' ? 'warn' : 'star'} />
                </div>
              </div>
            </section>
            <section>
              <SectionHeader icon={Baby} title="자녀운 및 양육 성향" flavorMode={flavorMode} />
              <p className="text-slate-200 font-medium text-sm leading-relaxed mb-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">{profile.children.overview}</p>
              <div className="bg-[#1e1b4b] p-5 rounded-2xl border border-indigo-900/50 shadow-sm">
                <h4 className="text-xs text-indigo-400 font-bold mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 긍정적 양육 포인트</h4>
                <BulletList items={profile.children.points} type="check" />
              </div>
            </section>
            <section>
              <SectionHeader icon={Shield} title="건강운 주의점" flavorMode={flavorMode} />
              <p className={`text-sm leading-relaxed mb-4 font-medium ${flavorMode === 'spicy' ? 'text-rose-300' : 'text-slate-200'}`}>{profile.health.overview}</p>
              <div className={`rounded-2xl p-5 border shadow-sm ${flavorMode === 'spicy' ? 'bg-[#4c0519]/40 border-rose-900/50' : 'bg-slate-800 border-slate-700'}`}>
                <BulletList items={profile.health.points} type="warn" />
              </div>
            </section>
          </div>
        </div>

        {/* 6. 나만의 프리미엄 개운법 (솔루션) */}
        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-sm relative bg-gradient-to-b from-[#1e1b4b]/40 to-slate-900 mt-6">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Sparkles className="w-32 h-32 text-purple-400" /></div>
          <h2 className="text-xl font-bold text-purple-400 border-b border-slate-700/80 pb-4 mb-6 relative z-10 flex items-center gap-2">
             <div className="p-1.5 bg-purple-500/10 rounded-md"><Sparkles className="w-5 h-5 text-purple-400"/></div>
             6. 나만의 프리미엄 개운법 (솔루션)
          </h2>
          <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6 relative z-10">
            {profile.luckySolution.reason.split(`'${profile.luckySolution.elementName}'`).map((part, i, arr) => 
               i === arr.length - 1 ? part : <span key={i}>{part}<span className={`font-bold ${profile.luckySolution.color}`}>'{profile.luckySolution.elementName}'</span></span>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            <div className={`p-5 rounded-2xl border ${profile.luckySolution.bg.replace('950', '900/30')} border-opacity-30 flex flex-col gap-3 shadow-sm bg-slate-800/80`}>
               <div className="flex items-center gap-2 text-white font-bold text-sm"><Palette className={`w-4 h-4 ${profile.luckySolution.color}`}/> 행운의 컬러 및 소품</div>
               <p className="text-sm text-slate-300 leading-relaxed font-medium"><span className="text-slate-400">색상:</span> {profile.luckySolution.data.color}</p>
               <p className="text-sm text-slate-300 leading-relaxed font-medium"><span className="text-slate-400">소품:</span> {profile.luckySolution.data.item}</p>
            </div>
            <div className={`p-5 rounded-2xl border ${profile.luckySolution.bg.replace('950', '900/30')} border-opacity-30 flex flex-col gap-3 shadow-sm bg-slate-800/80`}>
               <div className="flex items-center gap-2 text-white font-bold text-sm"><MapPin className={`w-4 h-4 ${profile.luckySolution.color}`}/> 긍정적 공간과 방향</div>
               <p className="text-sm text-slate-300 leading-relaxed font-medium"><span className="text-slate-400">방향:</span> 주요 가구를 {profile.luckySolution.data.direction}으로 배치</p>
               <p className="text-sm text-slate-300 leading-relaxed font-medium"><span className="text-slate-400">공간:</span> {profile.luckySolution.data.space}</p>
            </div>
            <div className={`p-5 rounded-2xl border ${profile.luckySolution.bg.replace('950', '900/30')} border-opacity-30 flex flex-col gap-3 shadow-sm bg-slate-800/80 sm:col-span-2`}>
               <div className="flex items-center gap-2 text-white font-bold text-sm"><Users className={`w-4 h-4 ${profile.luckySolution.color}`}/> 나를 돕는 귀인(사람)의 특징</div>
               <p className="text-sm text-slate-300 leading-relaxed font-medium">{profile.luckySolution.data.person}을 곁에 두면 {flavorMode === 'spicy' ? '쓸데없는 고집과 오만함을 꺾고 겨우 사람 구실을 할 수 있습니다.' : '일의 효율과 정서적 안정감이 크게 올라갑니다.'}</p>
            </div>
          </div>
        </div>

        {/* 7. 나의 10년 주기 큰 흐름 (대운) + 시각화 차트 */}
        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-sm relative bg-slate-900 mt-6">
          <SectionHeader icon={Activity} title="7. 나의 10년 주기 인생 바이오리듬 (대운)" subtitle="앞으로 40년간 펼쳐질 내 운세의 큰 파동" flavorMode={flavorMode} />
          
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 mb-8 overflow-x-auto">
            <p className="text-xs text-slate-400 font-bold mb-6 text-center">대운 에너지 흐름도</p>
            <div className="flex items-end justify-around h-32 w-full min-w-[280px] border-b border-slate-600 pb-2 gap-2 relative">
               <div className="absolute w-full border-t border-slate-700/50 top-1/2 left-0 border-dashed z-0"></div>
               {profile.daeun.map((daeun, idx) => {
                 const height = `${Math.max(20, daeun.score)}%`;
                 const colorClass = daeun.type === 'good' ? 'bg-amber-400' : daeun.type === 'warning' ? 'bg-rose-400' : 'bg-indigo-400';
                 return (
                   <div key={idx} className="flex flex-col items-center justify-end h-full w-full relative z-10 group cursor-default">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded text-white whitespace-nowrap z-20 shadow-lg">{daeun.keyword}</div>
                      <div className={`w-3/4 sm:w-1/2 max-w-[40px] rounded-t-sm transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${colorClass} opacity-80 group-hover:opacity-100`} style={{ height }}></div>
                      <span className="text-[10px] sm:text-xs text-slate-300 mt-3 font-bold">{daeun.startAge}세~</span>
                   </div>
                 )
               })}
            </div>
            <div className="flex justify-center gap-4 mt-4 text-[10px] text-slate-400">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"></div>도약/상승</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400"></div>안정/유지</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div>주의/압박</span>
            </div>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-700 z-10">
            {profile.daeun.map((daeun, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-20
                  ${daeun.type === 'good' ? 'bg-amber-500 text-white' : daeun.type === 'warning' ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'}`}>
                  {daeun.type === 'good' ? <ArrowUpRight className="w-5 h-5"/> : daeun.type === 'warning' ? <ArrowDownRight className="w-5 h-5"/> : <RefreshCw className="w-4 h-4"/>}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-slate-700/50 bg-slate-800 transition-colors shadow-sm hover:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-lg">{daeun.age}</span>
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-1 rounded bg-[#312e81] border border-indigo-500/30 text-indigo-300">{daeun.period}</span>
                  </div>
                  <div className={`text-sm font-bold mb-2 mt-2 ${daeun.type === 'good' ? 'text-amber-400' : daeun.type === 'warning' ? 'text-rose-400' : 'text-indigo-300'}`}>
                    "{daeun.keyword}"
                  </div>
                  <p className={`text-xs leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-300'}`}>{daeun.desc[flavorMode]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. 세운(올해 1년 운세)의 분기별 디테일 강화 */}
        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-sm relative overflow-hidden bg-[#0A0D14] mt-6">
          <h2 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2 relative z-10 border-b border-slate-700 pb-4">
            <div className="p-2 bg-[#78350f] rounded-lg"><Calendar className="w-5 h-5 text-amber-400"/></div>
            8. 2026년 신년 운세 심층 분석
          </h2>
          <div className="space-y-8 relative z-10">
            <div className="text-center pb-6">
              <h3 className="text-xl font-bold text-white mb-3">"{profile.yearly.title}"</h3>
              <p className={`text-sm font-medium leading-relaxed max-w-lg mx-auto ${flavorMode === 'spicy' ? 'text-rose-300' : 'text-slate-200'}`}>{profile.yearly.summary[flavorMode]}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {profile.yearly.keywords.map((kw, i) => <span key={i} className="px-3 py-1.5 bg-[#78350f] text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">#{kw}</span>)}
              </div>
            </div>

            <div className="pt-2">
               <h4 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-amber-500 rounded-sm"></div> 2026년 분기별 핵심 테마
               </h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {profile.yearly.quarters.map((q, idx) => (
                    <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm hover:bg-slate-700/50 transition-colors">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-amber-500 font-black text-xl italic">{q.q}</span>
                         <span className="text-xs font-bold text-slate-300">{q.title}</span>
                       </div>
                       <p className={`text-sm leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-400'}`}>{q.desc[flavorMode]}</p>
                    </div>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm"><h4 className="text-white font-bold mb-4 text-sm">직업/사업 흐름</h4>
                <div className="mb-4"><span className="text-xs text-emerald-400 font-bold block mb-2">좋은 방향</span><BulletList items={profile.yearly.career.good} type="check" /></div>
                <div className="border-t border-slate-700 pt-3"><span className="text-xs text-rose-400 font-bold block mb-2 mt-1">조심할 방향</span><BulletList items={profile.yearly.career.bad} type="warn" /></div>
              </div>
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm"><h4 className="text-white font-bold mb-4 text-sm">재물 흐름</h4>
                <div className="mb-4"><span className="text-xs text-blue-400 font-bold block mb-2">들어오는 돈</span><BulletList items={profile.yearly.wealth.in} type="dot" /></div>
                <div className="border-t border-slate-700 pt-3"><span className="text-xs text-amber-400 font-bold block mb-2 mt-1">나가는 돈</span><BulletList items={profile.yearly.wealth.out} type="dot" /></div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border shadow-lg mt-6 ${flavorMode === 'spicy' ? 'bg-[#4c0519]/80 border-rose-500/50' : 'bg-slate-900 border-slate-700'}`}>
              <h4 className={`${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-400'} font-bold mb-4 text-sm flex items-center gap-2`}>
                 {flavorMode === 'spicy' ? <AlertTriangle className="w-5 h-5"/> : <Sparkles className="w-5 h-5"/>} 
                 💡 2026년 성공을 위한 핵심 조언
              </h4>
              
              {flavorMode === 'spicy' ? (
                <div className="text-sm text-rose-100 leading-loose font-medium p-4 bg-rose-950/50 rounded-xl border border-rose-800/30">
                  {profile.yearly.core_advice.spicy}
                </div>
              ) : (
                <ul className="space-y-3">
                  {profile.yearly.core_advice.mild.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-200 leading-relaxed">
                      <Star className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 no-print">
          <button onClick={handleDownloadImage} disabled={isPrinting} className={`flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(217,119,6,0.4)] border border-amber-500 ${isPrinting ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isPrinting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />} 
            {isPrinting ? '고해상도 이미지 렌더링 중...' : '프리미엄 리포트 저장하기'}
          </button>
          <button onClick={() => { setSajuStep('input'); window.scrollTo(0, 0); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-500 shadow-sm">
            <RefreshCw className="w-4 h-4" /> 정보 다시 입력하기
          </button>
        </div>
      </div>
    );
  };

  const renderDailyTab = () => {
    if (dailyStep === 'input') return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/50 mt-4 sm:mt-10 mb-32 pb-6 shadow-xl animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-4 border border-amber-500/30 shadow-sm">
            <Sun className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-serif tracking-tight">오늘의 운세</h1>
          <p className="text-slate-400 text-sm">하루의 시작을 여는 오늘의 운세 흐름을 확인하세요.</p>
        </div>

        <FlavorToggle flavorMode={flavorMode} setFlavorMode={setFlavorMode} />

        <ProfileSelector savedProfiles={savedProfiles} onSelect={(p) => setFormData({...p})} />

        <form onSubmit={handleAnalyzeDaily} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1"><label className="block text-sm text-slate-300 font-medium mb-1">이름</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" required /></div>
            <div className="w-24 shrink-0"><label className="block text-sm text-slate-300 font-medium mb-1">성별</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none transition-all text-center">
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm text-slate-300 font-medium">생년월일</label>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                <button type="button" onClick={() => setFormData(prev => ({...prev, calendar: 'solar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${formData.calendar === 'solar' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>양력</button>
                <button type="button" onClick={() => setFormData(prev => ({...prev, calendar: 'lunar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${formData.calendar === 'lunar' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>음력</button>
              </div>
            </div>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none [&::-webkit-calendar-picker-indicator]:invert transition-all" required />
            {formData.calendar === 'lunar' && (
              <div className="mt-2 flex items-start gap-1.5 text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed font-medium">브라우저 환경의 한계로 음력 변환이 부정확할 수 있습니다. <b>가급적 달력에서 양력으로 변환 후 입력해 주세요.</b></p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-300 font-medium mb-1">태어난 시간</label>
            <select name="birthTime" value={formData.birthTime} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none transition-all">
              <option value="unknown">모름 (시간 제외 분석)</option>
              <option value="00:00">자시 (23:30 ~ 01:29)</option>
              <option value="02:00">축시 (01:30 ~ 03:29)</option>
              <option value="04:00">인시 (03:30 ~ 05:29)</option>
              <option value="06:00">묘시 (05:30 ~ 07:29)</option>
              <option value="08:00">진시 (07:30 ~ 09:29)</option>
              <option value="10:00">사시 (09:30 ~ 11:29)</option>
              <option value="12:00">오시 (11:30 ~ 13:29)</option>
              <option value="14:00">미시 (13:30 ~ 15:29)</option>
              <option value="16:00">신시 (15:30 ~ 17:29)</option>
              <option value="18:00">유시 (17:30 ~ 19:29)</option>
              <option value="20:00">술시 (19:30 ~ 21:29)</option>
              <option value="22:00">해시 (21:30 ~ 23:29)</option>
            </select>
          </div>
          <button type="submit" className={`w-full mt-6 text-white font-bold py-4 rounded-xl transition-all border text-lg ${flavorMode === 'spicy' ? 'bg-rose-600 hover:bg-rose-500 border-rose-500 shadow-[0_4px_20px_rgba(225,29,72,0.4)]' : 'bg-amber-600 hover:bg-amber-500 border-amber-500 shadow-[0_4px_20px_rgba(217,119,6,0.4)]'}`}>
            {flavorMode === 'spicy' ? '🔥 팩폭 운세 확인하기' : '오늘의 운세 확인하기'}
          </button>
        </form>
      </div>
    );

    if (dailyStep === 'loading') {
      const displayName = formData.name === '나(본인)' ? '회원' : formData.name;
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center mt-10">
          <div className="relative mb-8">
            <Sun className="w-20 h-20 text-amber-500/20 absolute -inset-2 animate-spin-slow rounded-full" />
            <Sun className="w-16 h-16 text-amber-400 relative z-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{displayName}님의 오늘을 분석 중입니다...</h2>
          <p className="text-slate-400 text-sm">실제 만세력 기반으로 오늘의 일진을 읽고 있습니다</p>
        </div>
      );
    }

    const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
    const daily = dailyResult;
    const displayName = formData.name === '나(본인)' ? '회원' : formData.name;

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up mt-4 sm:mt-8 pb-12 print-container bg-[#0A0D14] text-slate-200">
        <div className="hidden export-header text-center mb-8 border-b border-slate-700 pb-6 pt-4">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">오늘의 맞춤 운세 리포트 {flavorMode === 'spicy' && ' (팩폭 버전)'}</h1>
          <p className="text-slate-400 font-medium">발행일: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>

        {flavorMode === 'spicy' && (
          <div className="bg-rose-950 border-2 border-rose-500 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8 shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-pulse relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-20"><AlertTriangle className="w-24 h-24 text-rose-500" /></div>
            <div className="p-3 bg-rose-500 rounded-xl shrink-0 z-10"><AlertTriangle className="w-8 h-8 text-white" /></div>
            <div className="z-10 text-center sm:text-left">
              <h4 className="text-rose-400 font-black text-lg sm:text-xl mb-1 tracking-tight">🚨 멘탈 타격 주의보 (팩폭 모드 켜짐)</h4>
              <p className="text-sm text-rose-200 leading-relaxed font-medium">이 리포트는 위로와 포장을 완전히 걷어낸 <b className="text-white">극사실주의 직설 조언</b>입니다. 단점을 적나라하게 찌르기 때문에 상처를 받을 수 있습니다. 감당하기 어렵다면 지금이라도 상단의 '순한맛' 버튼을 눌러주세요.</p>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className={`${flavorMode === 'spicy' ? 'text-rose-500' : 'text-amber-500'} font-bold mb-1 text-sm tracking-widest`}>DAILY FORTUNE</h2>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayName}님의 오늘 ({today})</h1>
        </div>
        
        <div className={`pdf-solid-bg rounded-3xl p-6 sm:p-8 border text-center relative overflow-hidden shadow-sm ${flavorMode === 'spicy' ? 'border-rose-500/50 bg-[#4c0519]/20' : 'border-amber-500/30'}`}>
          <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
             {flavorMode === 'spicy' ? <Flame className="w-40 h-40 text-rose-500" /> : <Sun className="w-40 h-40 text-amber-500" />}
          </div>
          <p className={`text-sm font-bold mb-3 relative z-10 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-300'}`}>오늘의 총운</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 relative z-10 leading-snug">
            "{displayName}님,<br />
            {daily.total.title.split('\n').map((line, idx, arr) => (
              <React.Fragment key={idx}>
                {line}
                {idx !== arr.length - 1 && <br />}
              </React.Fragment>
            ))}"
          </h2>
          <p className={`text-sm leading-relaxed relative z-10 font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-200'}`}>{daily.total.desc}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10">
          <div className="pdf-solid-bg rounded-2xl p-4 text-center border border-slate-700/50 shadow-sm"><div className="w-10 h-10 mx-auto bg-[#4c0519] rounded-full flex items-center justify-center mb-3 border border-rose-900/50"><Heart className="w-5 h-5 text-rose-400"/></div><p className="text-xs text-slate-400 font-bold mb-1">애정운</p><p className="text-base font-bold text-white">{daily.scores.love}점</p></div>
          <div className="pdf-solid-bg rounded-2xl p-4 text-center border border-slate-700/50 shadow-sm"><div className="w-10 h-10 mx-auto bg-[#78350f] rounded-full flex items-center justify-center mb-3 border border-amber-900/50"><Coins className="w-5 h-5 text-amber-400"/></div><p className="text-xs text-slate-400 font-bold mb-1">재물운</p><p className="text-base font-bold text-white">{daily.scores.wealth}점</p></div>
          <div className="pdf-solid-bg rounded-2xl p-4 text-center border border-slate-700/50 shadow-sm"><div className="w-10 h-10 mx-auto bg-[#022c22] rounded-full flex items-center justify-center mb-3 border border-emerald-900/50"><Activity className="w-5 h-5 text-emerald-400"/></div><p className="text-xs text-slate-400 font-bold mb-1">건강운</p><p className="text-base font-bold text-white">{daily.scores.health}점</p></div>
        </div>

        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative z-10">
          <SectionHeader icon={Clock} title="시간대별 운세 흐름" subtitle="오늘 하루의 바이오리듬" flavorMode={flavorMode} />
          <div className="space-y-4">
            {daily.timeFlow.map((tf, idx) => (
              <div key={idx} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${tf.bgIcon} border ${tf.borderColor} flex items-center justify-center shrink-0`}>
                  <tf.icon className={`w-6 h-6 ${tf.color}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-bold mb-1 mt-0.5 ${tf.color}`}>{tf.time}</h4>
                  <p className="text-slate-200 text-sm leading-relaxed">{tf.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-sm bg-slate-900 relative z-10">
          <SectionHeader icon={Sparkles} title="나만의 행운 처방전" subtitle="오늘의 운기를 높여주는 아이템" flavorMode={flavorMode} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {daily.luckyItems.map((item, idx) => (
              <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center mb-3`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h4 className="text-xs text-slate-400 font-bold mb-1">{item.label}</h4>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative z-10">
          <SectionHeader icon={CheckCircle2} title="오늘의 조언" subtitle="행운을 부르고 불운을 막는 행동" flavorMode={flavorMode} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`rounded-2xl p-5 border shadow-sm ${flavorMode === 'spicy' ? 'bg-[#4c0519]/40 border-rose-900/50' : 'bg-slate-800 border-slate-700'}`}>
               <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><ThumbsUp className={`w-4 h-4 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-emerald-400'}`}/> 추천하는 행동</h4>
               <BulletList items={daily.doAndDont.do} type={flavorMode === 'spicy' ? 'warn' : 'check'} />
            </div>
            <div className={`rounded-2xl p-5 border shadow-sm ${flavorMode === 'spicy' ? 'bg-[#4c0519]/40 border-rose-900/50' : 'bg-slate-800 border-slate-700'}`}>
               <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><ThumbsDown className="w-4 h-4 text-rose-400"/> 피해야 할 행동</h4>
               <BulletList items={daily.doAndDont.dont} type="warn" />
            </div>
          </div>
        </div>

        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative z-10">
          <SectionHeader icon={Users} title="오늘의 인연" subtitle="나에게 도움이 되는 사람과 피해야 할 시기" flavorMode={flavorMode} />
          <div className="space-y-4">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
               <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><UserCheck className="w-4 h-4"/> {daily.relationship.good.title}</h4>
               <p className={`text-sm leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-200'}`}>{daily.relationship.good.desc}</p>
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
               <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2"><UserX className="w-4 h-4"/> {daily.relationship.bad.title}</h4>
               <p className={`text-sm leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-200'}`}>{daily.relationship.bad.desc}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 no-print">
          <button onClick={handleDownloadImage} disabled={isPrinting} className={`flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(217,119,6,0.4)] border border-amber-500 ${isPrinting ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isPrinting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />} 
            {isPrinting ? '고해상도 이미지 렌더링 중...' : '운세 리포트 저장하기'}
          </button>
          <button onClick={() => { setDailyStep('input'); window.scrollTo(0, 0); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-500 shadow-sm">
            <RefreshCw className="w-4 h-4" /> 정보 다시 입력하기
          </button>
        </div>
      </div>
    );
  };

  const renderMatchTab = () => {
    if (matchStep === 'input') return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-700/50 mt-4 sm:mt-10 mb-32 pb-6 shadow-xl animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-full mb-4 border border-rose-500/30 shadow-sm">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-serif tracking-tight">프리미엄 궁합 분석</h1>
          <p className="text-slate-400 text-sm">두 사람의 오행 상생과 결핍을 채워주는 심층 풀이입니다.</p>
        </div>

        <FlavorToggle flavorMode={flavorMode} setFlavorMode={setFlavorMode} />

        <form onSubmit={handleAnalyzeMatch} className="space-y-6">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 relative shadow-sm">
            <div className="absolute -top-3 left-4 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-xs font-bold text-indigo-400">나의 정보</div>
            <ProfileSelector savedProfiles={savedProfiles} onSelect={(p) => setFormData({...p})} />
            <div className="flex gap-4 mb-4">
              <div className="flex-1"><label className="block text-sm text-slate-300 font-medium mb-1">이름</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all" required /></div>
              <div className="w-24 shrink-0"><label className="block text-sm text-slate-300 font-medium mb-1">성별</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm text-center">
                  <option value="male">남성</option><option value="female">여성</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm text-slate-300 font-medium">생년월일</label>
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                  <button type="button" onClick={() => setFormData(prev => ({...prev, calendar: 'solar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${formData.calendar === 'solar' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>양력</button>
                  <button type="button" onClick={() => setFormData(prev => ({...prev, calendar: 'lunar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${formData.calendar === 'lunar' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>음력</button>
                </div>
              </div>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none [&::-webkit-calendar-picker-indicator]:invert text-sm transition-all" required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-1">태어난 시간 (모르면 생략)</label>
              <select name="birthTime" value={formData.birthTime} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all">
                <option value="unknown">모름 (시간 제외 분석)</option>
                <option value="00:00">자시 (23:30 ~ 01:29)</option><option value="02:00">축시 (01:30 ~ 03:29)</option><option value="04:00">인시 (03:30 ~ 05:29)</option>
                <option value="06:00">묘시 (05:30 ~ 07:29)</option><option value="08:00">진시 (07:30 ~ 09:29)</option><option value="10:00">사시 (09:30 ~ 11:29)</option>
                <option value="12:00">오시 (11:30 ~ 13:29)</option><option value="14:00">미시 (13:30 ~ 15:29)</option><option value="16:00">신시 (15:30 ~ 17:29)</option>
                <option value="18:00">유시 (17:30 ~ 19:29)</option><option value="20:00">술시 (19:30 ~ 21:29)</option><option value="22:00">해시 (21:30 ~ 23:29)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10"><div className="bg-rose-500 p-2 rounded-full border-4 border-slate-900"><Plus className="w-4 h-4 text-white"/></div></div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 relative shadow-sm">
            <div className="absolute -top-3 left-4 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-xs font-bold text-rose-400">상대방 정보</div>
            <ProfileSelector savedProfiles={savedProfiles} onSelect={(p) => setPartnerFormData({...p})} />
            <div className="flex gap-4 mb-4">
              <div className="flex-1"><label className="block text-sm text-slate-300 font-medium mb-1">이름</label><input type="text" name="name" value={partnerFormData.name} onChange={handlePartnerInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all" required /></div>
              <div className="w-24 shrink-0"><label className="block text-sm text-slate-300 font-medium mb-1">성별</label>
                <select name="gender" value={partnerFormData.gender} onChange={handlePartnerInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm text-center">
                  <option value="male">남성</option><option value="female">여성</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm text-slate-300 font-medium">생년월일</label>
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                  <button type="button" onClick={() => setPartnerFormData(prev => ({...prev, calendar: 'solar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${partnerFormData.calendar === 'solar' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>양력</button>
                  <button type="button" onClick={() => setPartnerFormData(prev => ({...prev, calendar: 'lunar'}))} className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${partnerFormData.calendar === 'lunar' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>음력</button>
                </div>
              </div>
              <input type="date" name="birthDate" value={partnerFormData.birthDate} onChange={handlePartnerInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none [&::-webkit-calendar-picker-indicator]:invert text-sm transition-all" required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-1">태어난 시간 (모르면 생략)</label>
              <select name="birthTime" value={partnerFormData.birthTime} onChange={handlePartnerInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all">
                <option value="unknown">모름 (시간 제외 분석)</option>
                <option value="00:00">자시 (23:30 ~ 01:29)</option><option value="02:00">축시 (01:30 ~ 03:29)</option><option value="04:00">인시 (03:30 ~ 05:29)</option>
                <option value="06:00">묘시 (05:30 ~ 07:29)</option><option value="08:00">진시 (07:30 ~ 09:29)</option><option value="10:00">사시 (09:30 ~ 11:29)</option>
                <option value="12:00">오시 (11:30 ~ 13:29)</option><option value="14:00">미시 (13:30 ~ 15:29)</option><option value="16:00">신시 (15:30 ~ 17:29)</option>
                <option value="18:00">유시 (17:30 ~ 19:29)</option><option value="20:00">술시 (19:30 ~ 21:29)</option><option value="22:00">해시 (21:30 ~ 23:29)</option>
              </select>
            </div>
          </div>
          <button type="submit" className={`w-full mt-4 text-white font-bold py-4 rounded-xl transition-all border text-lg shadow-sm ${flavorMode === 'spicy' ? 'bg-rose-600 hover:bg-rose-500 border-rose-500 shadow-[0_4px_20px_rgba(225,29,72,0.4)]' : 'bg-rose-600 hover:bg-rose-500 border-rose-500 shadow-[0_4px_20px_rgba(225,29,72,0.4)]'}`}>
            {flavorMode === 'spicy' ? '🔥 팩폭 궁합 확인하기' : '프리미엄 궁합 분석하기'}
          </button>
        </form>
      </div>
    );

    if (matchStep === 'loading') return (
      <div className="flex flex-col items-center justify-center py-32 text-center mt-10">
        <div className="relative mb-8">
          <Heart className="w-20 h-20 text-rose-500/20 absolute -inset-2 animate-ping rounded-full" />
          <Heart className="w-16 h-16 text-rose-500 relative z-10 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">두 분의 인연을 엮어보고 있습니다...</h2>
        <p className="text-slate-400 text-sm">오행의 상생상극과 사주팔자의 합을 스캔 중입니다</p>
      </div>
    );

    const { myPillars, partnerPillars, profile } = matchResult;
    const myName = formData.name === '나(본인)' ? '나' : formData.name;
    const partnerName = partnerFormData.name === '나(본인)' ? '상대방' : partnerFormData.name;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up mt-4 sm:mt-8 pb-12 print-container bg-[#0A0D14] text-slate-200">
        <div className="hidden export-header text-center mb-8 border-b border-slate-700 pb-6 pt-4">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">프리미엄 궁합 분석 리포트 {flavorMode === 'spicy' && ' (팩폭 버전)'}</h1>
          <p className="text-slate-400 font-medium">발행일: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>

        {flavorMode === 'spicy' && (
          <div className="bg-rose-950 border-2 border-rose-500 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8 shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-pulse relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-20"><AlertTriangle className="w-24 h-24 text-rose-500" /></div>
            <div className="p-3 bg-rose-500 rounded-xl shrink-0 z-10"><AlertTriangle className="w-8 h-8 text-white" /></div>
            <div className="z-10 text-center sm:text-left">
              <h4 className="text-rose-400 font-black text-lg sm:text-xl mb-1 tracking-tight">🚨 궁합 팩폭 주의보</h4>
              <p className="text-sm text-rose-200 leading-relaxed font-medium">이 궁합 리포트는 두 사람의 최악의 단점을 여과 없이 드러냅니다. 서로 기분 상할 수 있으니 혼자만 보거나, 멘탈이 약하다면 뒤로가기를 눌러주세요.</p>
            </div>
          </div>
        )}

        <div className={`pdf-solid-bg rounded-3xl p-6 sm:p-8 border text-center relative overflow-hidden shadow-sm bg-gradient-to-br ${flavorMode === 'spicy' ? 'from-[#4c0519]/50 to-[#1c1917] border-rose-500/30' : 'from-slate-900 to-[#1c1917] border-rose-500/30'}`}>
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Heart className="w-32 h-32 text-rose-400" /></div>
          <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-4 py-1.5 rounded-full border border-rose-500/30 tracking-widest relative z-10">PREMIUM MATCH REPORT</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-5 mb-6 relative z-10">{myName}님과 {partnerName}님의 궁합</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between relative z-10">
            <div className="flex-1 bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 w-full shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
               <span className="text-xs font-bold text-indigo-400 mb-2 block">{myName} ({ELEMENTS[myPillars.day.stem.element].name})</span>
               <div className="flex gap-2">
                 <PillarBox title="일주" data={myPillars.day} /><PillarBox title="월주" data={myPillars.month} />
               </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/30 my-2 sm:my-0 shadow-sm"><RefreshCw className="w-5 h-5 text-rose-400" /></div>
            
            <div className="flex-1 bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 w-full shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
               <span className="text-xs font-bold text-rose-400 mb-2 block">{partnerName} ({ELEMENTS[partnerPillars.day.stem.element].name})</span>
               <div className="flex gap-2">
                 <PillarBox title="일주" data={partnerPillars.day} /><PillarBox title="월주" data={partnerPillars.month} />
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="pdf-solid-bg bg-[#4c0519]/20 rounded-3xl p-6 sm:p-8 border border-rose-500/30 text-center flex flex-col justify-center shadow-sm">
             <p className="text-sm font-bold text-rose-400 mb-2 tracking-widest">종합 궁합 점수</p>
             <div className="text-5xl font-black text-white font-serif mb-2">{profile.score}<span className="text-2xl text-rose-400 ml-1">점</span></div>
             <p className={`text-sm mt-3 leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-300'}`}>{profile.title}</p>
          </div>
          <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 flex flex-col justify-center space-y-4 shadow-sm bg-slate-900">
             {profile.details.map((d, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                   <div className={`w-12 h-12 rounded-full ${d.bg} flex items-center justify-center border border-slate-600/50 shrink-0`}><d.icon className={`w-6 h-6 ${d.color}`} /></div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-sm font-bold text-white">{d.category}</span>
                         <span className={`text-sm font-black ${d.color}`}>{d.score}점</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                         <div className={`h-full ${d.color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${d.score}%` }}></div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-sm relative">
          <SectionHeader icon={Info} title="두 사람의 관계성 심층 분석" flavorMode={flavorMode} />
          <div className="space-y-6">
             <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
                <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2"><Star className="w-4 h-4"/> 기운의 융합</h4>
                <p className={`text-sm leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-200'}`}>{profile.summary}</p>
             </div>
             <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
                <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2"><MoonStar className="w-4 h-4"/> {profile.element_match.title}</h4>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{profile.element_match.desc}</p>
                <div className="w-full border-t border-slate-700 my-4"></div>
                <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2"><Heart className="w-4 h-4"/> {profile.secret_chemistry.title}</h4>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{profile.secret_chemistry.desc}</p>
             </div>
             <div className="bg-[#022c22] p-5 rounded-2xl border border-emerald-900/50 shadow-sm">
                <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> 상호 보완성 (결핍 충족률 {profile.complement_rate.score}%)</h4>
                <p className="text-emerald-100 text-sm leading-relaxed font-medium">{profile.complement_rate.desc}</p>
             </div>
          </div>
        </div>

        <div className="pdf-solid-bg rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-sm relative bg-[#0A0D14]">
          <SectionHeader icon={MessageCircle} title="갈등 해결과 미래 조언" flavorMode={flavorMode} />
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
                   <span className="text-xs text-indigo-400 font-bold mb-1 block">나의 다툼 원인</span>
                   <p className="text-sm text-white font-bold">{profile.conflict_resolution.my_trait}</p>
                </div>
                <div className="flex-1 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
                   <span className="text-xs text-rose-400 font-bold mb-1 block">상대방의 다툼 원인</span>
                   <p className="text-sm text-white font-bold">{profile.conflict_resolution.partner_trait}</p>
                </div>
             </div>
             <div className={`p-5 rounded-2xl border shadow-sm ${flavorMode === 'spicy' ? 'bg-rose-950/40 border-rose-900/50' : 'bg-slate-800 border-slate-700'}`}>
                <h4 className={`${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-400'} font-bold mb-3 text-sm flex items-center gap-2`}><AlertTriangle className="w-4 h-4"/> 갈등 시 해결 방안</h4>
                <p className={`text-sm leading-relaxed font-medium ${flavorMode === 'spicy' ? 'text-rose-200' : 'text-slate-200'}`}>{profile.conflict_resolution.solution}</p>
             </div>
             
             <div className="bg-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-sm">
                <h4 className="text-indigo-400 font-bold mb-3 text-sm flex items-center gap-2"><Calendar className="w-4 h-4"/> 두 사람의 베스트 타이밍 ({profile.best_timing.year}년)</h4>
                <p className="text-sm text-slate-200 leading-relaxed font-medium"><span className="font-bold text-white block mb-1">"{profile.best_timing.name}"</span>{profile.best_timing.desc}</p>
             </div>

             <div className={`p-6 rounded-2xl border shadow-lg relative overflow-hidden ${flavorMode === 'spicy' ? 'bg-[#4c0519]' : 'bg-slate-800'} ${flavorMode === 'spicy' ? 'border-rose-500' : 'border-amber-500/50'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className={`w-16 h-16 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-400'}`} /></div>
                <h4 className={`font-bold mb-4 flex items-center gap-2 relative z-10 ${flavorMode === 'spicy' ? 'text-rose-400' : 'text-amber-400'}`}>💡 관계 유지를 위한 조언</h4>
                <BulletList items={profile.advice} type={flavorMode === 'spicy' ? 'warn' : 'star'} />
                
                {/* 궁합 전문가의 한줄평 (강조) */}
                <div className={`mt-6 pt-5 border-t border-opacity-50 relative z-10 ${flavorMode === 'spicy' ? 'border-rose-500/50' : 'border-slate-600'}`}>
                  <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${flavorMode === 'spicy' ? 'text-rose-300' : 'text-amber-300'}`}>
                    <MessageSquare className="w-4 h-4" /> 전문가의 냉정한 한줄평
                  </h4>
                  <p className={`text-base font-black leading-relaxed italic ${flavorMode === 'spicy' ? 'text-rose-100' : 'text-white'}`}>
                    "{profile.final_verdict}"
                  </p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 no-print">
          <button onClick={handleDownloadImage} disabled={isPrinting} className={`flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(225,29,72,0.4)] border border-rose-500 ${isPrinting ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isPrinting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />} 
            {isPrinting ? '고해상도 이미지 렌더링 중...' : '궁합 리포트 저장하기'}
          </button>
          <button onClick={() => { setMatchStep('input'); window.scrollTo(0, 0); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-500 shadow-sm">
            <RefreshCw className="w-4 h-4" /> 정보 다시 입력하기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-200 font-sans selection:bg-indigo-500/30">
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 shadow-sm no-print">
        <div className="max-w-md md:max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="bg-indigo-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-sm">
               <Moon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors font-serif">사주로그</span>
          </div>
          {isLoggedIn ? (
            <button onClick={() => setActiveTab('mypage')} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 transition-colors shadow-sm">
              <UserCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">마이페이지</span>
            </button>
          ) : (
            <div className="hidden sm:flex gap-2">
              <button onClick={() => handleLogin('kakao')} className="bg-[#FEE500] hover:bg-[#FDD800] text-black text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm">
                <MessageCircle className="w-3.5 h-3.5" /> 3초만에 로그인
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-16 pb-24 px-4 min-h-screen flex flex-col">
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up py-10">
            <div className="relative mb-6">
               <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
               <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 relative z-10 shadow-lg">
                 <Moon className="w-12 h-12 text-indigo-400" />
               </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center tracking-tight font-serif">당신의 운명을 읽다,<br/>프리미엄 사주로그</h2>
            <p className="text-slate-400 text-center text-sm mb-10 font-medium">로그인하고 나만의 10년 주기 대운과<br/>오늘의 운세를 무료로 확인하세요.</p>
            <div className="w-full max-w-sm space-y-3">
              <button onClick={() => handleLogin('kakao')} className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm">
                <MessageCircle className="w-5 h-5" /> 카카오로 3초만에 시작하기
              </button>
              <button onClick={() => handleLogin('naver')} className="w-full bg-[#03C75A] hover:bg-[#02b351] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm">
                <MessageSquare className="w-5 h-5" /> 네이버로 3초만에 시작하기
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && renderHomeTab()}
            {activeTab === 'saju' && renderSajuTab()}
            {activeTab === 'match' && renderMatchTab()}
            {activeTab === 'daily' && renderDailyTab()}
            {activeTab === 'mypage' && renderMyPageTab()}
          </>
        )}
      </main>

      {isLoggedIn && (
        <div className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 pb-safe pt-2 px-6 pb-2 z-50 no-print shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
          <div className="max-w-md mx-auto flex justify-between items-center relative">
            <button onClick={() => { setActiveTab('home'); }} className={`flex flex-col items-center p-2 transition-all ${activeTab === 'home' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              <Home className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'text-indigo-400' : ''}`} /><span className="text-[10px] font-bold">홈</span>
            </button>
            <button onClick={() => { setActiveTab('daily'); setDailyStep('input'); window.scrollTo(0, 0); }} className={`flex flex-col items-center p-2 transition-all ${activeTab === 'daily' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              <Sun className={`w-6 h-6 mb-1 ${activeTab === 'daily' ? 'text-amber-400' : ''}`} /><span className="text-[10px] font-bold">오늘운세</span>
            </button>
            <div className="relative -top-6">
              <button onClick={() => { setActiveTab('saju'); setSajuStep('input'); window.scrollTo(0, 0); }} className={`flex flex-col items-center p-3 sm:p-4 rounded-full transition-transform hover:scale-105 shadow-lg border-4 border-[#0A0D14] ${activeTab === 'saju' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                <BookOpen className={`w-6 h-6 ${activeTab === 'saju' ? 'text-white' : ''}`} />
              </button>
              <span className={`text-[10px] font-bold absolute -bottom-5 w-full text-center ${activeTab === 'saju' ? 'text-white' : 'text-slate-500'}`}>프리미엄</span>
            </div>
            <button onClick={() => { setActiveTab('match'); setMatchStep('input'); window.scrollTo(0, 0); }} className={`flex flex-col items-center p-2 transition-all ${activeTab === 'match' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              <Heart className={`w-6 h-6 mb-1 ${activeTab === 'match' ? 'text-rose-400' : ''}`} /><span className="text-[10px] font-bold">궁합</span>
            </button>
            <button onClick={() => { setActiveTab('mypage'); window.scrollTo(0, 0); }} className={`flex flex-col items-center p-2 transition-all ${activeTab === 'mypage' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              <Users className={`w-6 h-6 mb-1 ${activeTab === 'mypage' ? 'text-purple-400' : ''}`} /><span className="text-[10px] font-bold">내인연</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
