import React, { useState, useEffect } from 'react';
import { Moon, Sun, Sunrise, Sparkles, Star, ChevronRight, RefreshCw, Heart, Coins, Briefcase, User, CheckCircle2, AlertTriangle, TrendingUp, Calendar, Shield, Zap, BookOpen, Compass, Clock, Activity, Target, Image as ImageIcon, Users, PieChart, Flame, MessageCircle, MessageSquare, Palette, Hash, Coffee, ThumbsUp, ThumbsDown, UserCheck, UserX, Info, Baby, ArrowUpRight, ArrowDownRight, MapPin, Home, UserCircle, Plus, Trash2, MoonStar, Edit2 } from 'lucide-react';

// --- Firebase & API 설정 ---
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAARnJl7X1ADsVGrmXlrci7TXL4O-M2PLg",
  authDomain: "sauj-log.firebaseapp.com",
  projectId: "sauj-log",
  storageBucket: "sauj-log.firebasestorage.app",
  messagingSenderId: "467164186633",
  appId: "1:467164186633:web:ab03ddf06195d75f8f50d8",
  measurementId: "G-29MW9HTJWF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const KAKAO_CLIENT_ID = "586f10b5411b3efee4760027d8cdcbba";
const NAVER_CLIENT_ID = "traV_20kygwvnN7U0BZD";

// --- [데이터 정의] ---
const ELEMENTS = {
  wood: { color: 'text-emerald-400', bg: 'bg-emerald-950', border: 'border-emerald-800/50', name: '나무(木)' },
  fire: { color: 'text-rose-400', bg: 'bg-rose-950', border: 'border-rose-800/50', name: '불(火)' },
  earth: { color: 'text-amber-400', bg: 'bg-amber-950', border: 'border-amber-800/50', name: '흙(土)' },
  metal: { color: 'text-slate-300', bg: 'bg-slate-800', border: 'border-slate-600/50', name: '쇠(金)' },
  water: { color: 'text-blue-400', bg: 'bg-blue-950', border: 'border-blue-800/50', name: '물(水)' },
};

const CHEONGAN = [{char:'甲',kor:'갑',element:'wood'},{char:'乙',kor:'을',element:'wood'},{char:'丙',kor:'병',element:'fire'},{char:'丁',kor:'정',element:'fire'},{char:'戊',kor:'무',element:'earth'},{char:'己',kor:'기',element:'earth'},{char:'庚',kor:'경',element:'metal'},{char:'辛',kor:'신',element:'metal'},{char:'壬',kor:'임',element:'water'},{char:'癸',kor:'계',element:'water'}];
const JIJI = [{char:'子',kor:'자',element:'water',animal:'쥐'},{char:'丑',kor:'축',element:'earth',animal:'소'},{char:'寅',kor:'인',element:'wood',animal:'호랑이'},{char:'卯',kor:'묘',element:'wood',animal:'토끼'},{char:'辰',kor:'진',element:'earth',animal:'용'},{char:'巳',kor:'사',element:'fire',animal:'뱀'},{char:'午',kor:'오',element:'fire',animal:'말'},{char:'未',kor:'미',element:'earth',animal:'양'},{char:'申',kor:'신',element:'metal',animal:'원숭이'},{char:'酉',kor:'유',element:'metal',animal:'닭'},{char:'戌',kor:'술',element:'earth',animal:'개'},{char:'亥',kor:'해',element:'water',animal:'돼지'}];

const SINSAL_DATA = {
  도화: { name: '도화살(桃花殺)', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', keyword: '매력과 사교성', desc: { mild: "사람을 끌어당기는 특유의 매력과 스타성이 있습니다. 대인관계에서 호감을 쉽게 얻습니다.", spicy: "가만히 있어도 피곤한 일에 엮이거나 쓸데없이 이성 문제를 일으킵니다. 구설수를 조심하세요." } },
  역마: { name: '역마살(驛馬殺)', icon: Compass, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', keyword: '이동과 활동성', desc: { mild: "한곳에 머무르기보다 돌아다니고 경험하며 에너지를 얻습니다. 영업이나 출장이 잦은 직무와 찰떡입니다.", spicy: "엉덩이가 가벼워서 한 가지 일을 진득하게 못 합니다. 뭐 하나 끝맺음 없는 산만한 팔자입니다." } },
  화개: { name: '화개살(華蓋殺)', icon: MoonStar, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', keyword: '예술과 고독', desc: { mild: "감수성이 풍부하고 생각의 깊이가 남다릅니다. 화려함을 덮고 내면을 탐구하는 기운이 강합니다.", spicy: "허구한 날 방구석에 틀어박혀 쓰잘데기 없는 망상이나 하는 현실 도피자입니다." } },
  백호: { name: '백호대살(白虎大殺)', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', keyword: '폭발적 에너지', desc: { mild: "평소에는 얌전해도 위기 상황에서 엄청난 폭발력을 보여주는 카리스마가 있습니다.", spicy: "분노 조절 장애 수준으로 한번 욱하면 앞뒤 안 가리고 폭주합니다. 고립되기 쉽습니다." } },
  괴강: { name: '괴강살(魁罡殺)', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', keyword: '우두머리의 기질', desc: { mild: "타인의 지배를 받기 싫어하는 강한 리더십과 총명함이 있습니다. 사업가에 적합합니다.", spicy: "남 밑에서 절대 고개 못 숙이는 뻣뻣한 오만의 끝판왕입니다. 지 잘난 맛에 살다 한 방 먹습니다." } }
};

const ELEMENT_TRAITS = {
  wood: { keyword: "성장과 기획", desc: { mild: "시작하는 에너지가 강하며 기획력이 뛰어나고 위로 뻗어나가려는 성향입니다.", spicy: "일단 저지르고 보는 추진력은 최고지만, 뒤수습은 늘 주변 사람의 몫으로 남깁니다." }, strength: "방향이 맞다고 판단되면 바로 움직이는 강한 추진력", weakness: { mild: "시작은 좋으나 마무리가 약할 수 있습니다.", spicy: "일만 잔뜩 벌리고 마무리는 절대 못 하는 극강의 용두사미." } },
  fire: { keyword: "열정과 명예", desc: { mild: "감정이 풍부하고 리더십이 돋보이며, 자신을 표현하는 것을 중요하게 생각합니다.", spicy: "자기가 세상의 중심이어야 직성이 풀리는 관종끼가 다분합니다." }, strength: "뛰어난 언변과 사람을 끌어당기는 매력", weakness: { mild: "성격이 급할 수 있고 감정의 기복이 잘 드러남", spicy: "욱하는 성질을 못 죽여서 다 된 밥에 재를 빠뜨리는 독불장군." } },
  earth: { keyword: "신뢰와 포용", desc: { mild: "중재자 역할을 잘하며 흔들림 없이 묵묵히 결과를 만들어냅니다.", spicy: "본인만의 꽉 막힌 철학에 갇혀 남의 말은 안 듣는 답답함의 상징입니다." }, strength: "어떤 상황에서도 중심을 잃지 않는 포용력", weakness: { mild: "변화에 적응하는 속도가 느리고 고집이 강함", spicy: "아집이 너무 강해 변화를 두려워하는 고집불통 그 자체." } },
  metal: { keyword: "결단과 원칙", desc: { mild: "판단이 빠르고 옳고 그름의 기준이 분명하여 실무적인 이미지를 줍니다.", spicy: "공감 능력은 바닥이면서 팩트 폭력이랍시고 함부로 입을 놀려 상처를 줍니다." }, strength: "사람이나 일을 볼 때 명확한 기준을 가짐", weakness: { mild: "타인이 비효율적이면 답답함을 느끼고 말이 날카로움", spicy: "자기 기준만 정답인 줄 아는 꼰대 기질로 주변 사람이 안 남음." } },
  water: { keyword: "지혜와 유연성", desc: { mild: "상황 적응력이 뛰어나고 속을 깊이 알 수 없는 지혜로움이 있습니다.", spicy: "머릿속으로만 시뮬레이션을 돌리고 막상 실천은 안 하는 게으른 완벽주의자입니다." }, strength: "탁월한 아이디어와 깊은 통찰력", weakness: { mild: "생각이 많아 실행이 늦어지거나 우울감에 빠지기 쉬움", spicy: "끝없는 우울감에 빠져 주변의 에너지까지 빨아먹음." } }
};

const ELEMENT_ANALYSIS = {
  wood: { excess: { mild: "시작하는 일만 많고 마무리가 안 될 수 있습니다. 고집을 주의하세요.", spicy: "쓸데없는 오지랖으로 자기 밥그릇 다 엎어버리는 꼴입니다." }, lack: { mild: "새로운 모험에 두려움이 있습니다. 작은 목표부터 세우세요.", spicy: "실패가 두려워 아무것도 시도 못하는 겁쟁이입니다." } },
  fire: { excess: { mild: "감정 기복이 심해질 수 있습니다. 욱하는 마음을 다스리세요.", spicy: "감정이 널뜁니다. 성질 머리 못 고치면 주변에 아무도 안 남습니다." }, lack: { mild: "자신을 어필하는 표현력이 부족할 수 있습니다.", spicy: "물에 물 탄 듯 무기력함의 극치. 목소리 좀 내세요." } },
  earth: { excess: { mild: "변화를 싫어하고 고집에 갇힐 수 있으니 유연한 사고가 필요합니다.", spicy: "타인의 조언은 개나 줘버리는 태산에 갇힌 똥고집입니다." }, lack: { mild: "한곳에 정착하지 못할 수 있습니다. 확고한 신념이 중요합니다.", spicy: "조금만 힘들면 철새처럼 도망가는 습관 당장 고치세요." } },
  metal: { excess: { mild: "성격이 날카로워 주변에 상처를 줄 수 있습니다. 포용력을 기르세요.", spicy: "숨 막히는 강박증. 내 방식만 맞다며 비난하니 다 떠납니다." }, lack: { mild: "원칙을 밀어붙이는 힘이 약합니다. 객관적 기준을 세우세요.", spicy: "우유부단함의 끝판왕. 정에 휩쓸려 호구 잡히기 딱 좋습니다." } },
  water: { excess: { mild: "우울감이나 잡생각에 빠지기 쉽습니다. 몸을 움직여야 합니다.", spicy: "끝도 없는 우울의 늪. 생각만 하고 실천 안 하는 게으름뱅이입니다." }, lack: { mild: "상황에 유연하게 대처하는 능력이 떨어질 수 있습니다.", spicy: "꽉 막힌 벽창호. 뻣뻣하게 굴다가 억울하게 손해만 봅니다." } }
};

const LUCKY_SOLUTIONS = {
  wood: { color: "초록색, 민트색", item: "화분, 나무 소재 소품", space: "공원, 숲, 식물이 많은 곳", person: "활동적이고 나에게 동기를 부여해 주는 사람", direction: "동쪽 (East)" },
  fire: { color: "붉은색, 분홍색, 오렌지색", item: "조명, 화려한 악세서리", space: "햇빛이 잘 드는 번화가", person: "열정적이고 칭찬이 풍부한 사람", direction: "남쪽 (South)" },
  earth: { color: "노란색, 베이지색, 브라운", item: "도자기, 크리스탈 소품", space: "아늑하고 조용한 집안", person: "신뢰할 수 있고 내 말을 잘 들어주는 사람", direction: "중앙 (거주지 중심)" },
  metal: { color: "흰색, 은색, 회색", item: "금속 시계, 메탈릭 소품", space: "세련되고 모던한 공간", person: "논리적이고 배울 점이 있는 사람", direction: "서쪽 (West)" },
  water: { color: "검은색, 네이비색", item: "어항, 유리 공예품", space: "강변, 잔잔한 음악이 흐르는 공간", person: "지혜로우며 나의 감수성을 이해하는 사람", direction: "북쪽 (North)" }
};

const WEALTH_TRAITS = {
  wood: { overview: "기획을 통해 재물을 창출하며 성장하는 장기 투자에 유리합니다.", good: ["교육, 기획 수익", "장기 투자"], bad: { mild: ["충동적 지출"], spicy: ["지인 말만 믿고 던지는 묻지마 투자"] } },
  fire: { overview: "명예가 높아질수록 재물이 따라붙는 '명예형 재물운'입니다.", good: ["개인 브랜딩 수익", "영업 인센티브"], bad: { mild: ["체면 유지를 위한 과소비"], spicy: ["남들 시선 의식해서 긁어대는 폼생폼사 카드 빚"] } },
  earth: { overview: "티끌 모아 태산을 이루는 안정적인 재물운입니다.", good: ["부동산, 청약", "정기 적금"], bad: { mild: ["단기 투자", "지인 금전 거래"], spicy: ["가족/지인 보증 서주다 인생 같이 망하는 지름길"] } },
  metal: { overview: "돈의 흐름을 잘 읽고 맺고 끊음이 확실해 재물이 새지 않습니다.", good: ["금융, 관리 수익", "수수료 기반 수익"], bad: { mild: ["원칙주의로 기회 상실"], spicy: ["과도한 쫄보 기질로 인플레이션에 계좌 녹음"] } },
  water: { overview: "유연하게 돈을 벌며, 정보력과 아이디어가 돈이 되는 지식형 재물운입니다.", good: ["지적 재산권, 특허", "전략적 투자"], bad: { mild: ["생각만 하다 놓치는 타이밍"], spicy: ["잔머리 굴리다 시장한테 맞고 계좌 청산"] } }
};

const CAREER_TRAITS = {
  wood: { overview: "무에서 유를 창조하는 기획이나 교육업에 적합합니다.", suitable: ["기획자, 교육", "건축, 디자인", "스타트업, IT"] },
  fire: { overview: "자신을 드러내고 남들에게 영감을 주는 분야에서 빛을 발합니다.", suitable: ["방송, 마케팅", "뷰티, 패션", "요식업, 스포츠"] },
  earth: { overview: "조직을 안정시키는 역할이나 자산을 다루는 일에 능합니다.", suitable: ["부동산, 인사", "종교, 철학", "자산 관리"] },
  metal: { overview: "분석력이 필요한 전문직이나 숫자를 다루는 일에서 성공합니다.", suitable: ["금융, 세무", "법률, 의료", "엔지니어, 컨설팅"] },
  water: { overview: "뛰어난 정보력을 활용하거나 물자가 흐르는 직업이 좋습니다.", suitable: ["무역, 유통", "연구원, 학자", "심리 상담, 예술"] }
};

const HEALTH_TRAITS = {
  wood: { overview: { mild: "간, 신경계 예민. 피로 조심.", spicy: "맨날 밤새면 병원 신세 뼈저리게 후회함." }, points: { mild: ["만성 피로", "눈 피로", "어깨 경직"], spicy: ["운동 부족 쓰레기 체력", "스트레스성 폭음"] } },
  fire: { overview: { mild: "심장, 혈압 주의. 감정 기복 다스리기.", spicy: "욱하는 성질 못 죽이면 고혈압으로 쓰러짐." }, points: { mild: ["혈압 변동", "불면증", "가슴 답답함"], spicy: ["홧병과 탈모", "자극적 식습관"] } },
  earth: { overview: { mild: "소화기관 약화. 스트레스시 소화 안됨.", spicy: "먹는 걸로 스트레스 풀다 고도비만 됨." }, points: { mild: ["소화 불량", "체중 증가", "수족 냉증"], spicy: ["야식 시키는 버릇", "먹고 눕는 식도염"] } },
  metal: { overview: { mild: "호흡기 약함. 습도 조절 필수.", spicy: "운동 안해서 면역력 바닥침." }, points: { mild: ["비염, 기관지염", "장 트러블", "피부 건조"], spicy: ["미세먼지 핑계 칩거", "수분 부족"] } },
  water: { overview: { mild: "신장, 방광 주의. 체온 유지 필수.", spicy: "신장 최약체. 폭음하면 명줄 짧아짐." }, points: { mild: ["아침 붓기", "허리 통증", "우울감"], spicy: ["짠거 먹고 붓기", "폭음으로 비뇨기 망침"] } }
};

const REL_TRAITS = {
  wood: { overview: "다정다감하나 한 번 맘 상하면 뒤돌아보지 않음.", spouse: "순수한 애정을 원하며 함께 성장할 동반자.", tips: { mild: ["간섭을 통제로 느끼지 않기"], spicy: ["남 가르치려는 꼰대짓 멈추기"] } },
  fire: { overview: "감정 표현이 솔직하고 기복이 있음.", spouse: "나를 자랑스럽게 여겨주고 리액션 좋은 사람.", tips: { mild: ["감정 격해질 때 말 멈추기"], spicy: ["욱해서 막말하고 후회하지 않기"] } },
  earth: { overview: "포용력이 넓으나 속마음은 안 꺼냄.", spouse: "변함없이 나를 지켜주는 듬직한 사람.", tips: { mild: ["약점 솔직하게 털어놓기"], spicy: ["속마음 숨겨두고 왜 안 알아주냐 탓하지 않기"] } },
  metal: { overview: "맺고 끊음이 확실함. 신뢰 깨지면 정리.", spouse: "책임감 강하고 서로의 선을 존중해주는 사람.", tips: { mild: ["날카로운 팩폭 자제하기"], spicy: ["팩폭 명분으로 칼날 날리기 버리기"] } },
  water: { overview: "친화력은 좋으나 혼자만의 충전 시간이 필수.", spouse: "내 감수성을 이해하는 지적인 사람.", tips: { mild: ["내 감정을 적극적으로 표현하기"], spicy: ["불만 생기면 동굴로 잠수타는 버릇 고치기"] } }
};

const CHILDREN_TRAITS = {
  wood: { overview: "자유롭게 뛰어놀며 스스로 성장하도록 돕는 '방목형' 부모입니다.", points: ["친구처럼 편안한 관계", "과정을 칭찬함"] },
  fire: { overview: "자녀의 재능을 일찍 발견하고 열정적으로 지원하는 부모입니다.", points: ["적극적인 교육 지원", "성취에 대한 큰 리액션"] },
  earth: { overview: "안정적인 환경을 제공하며 흔들림 없이 기다려주는 든든한 부모입니다.", points: ["일관된 양육", "정서적 안정감 부여"] },
  metal: { overview: "옳고 그름의 기준을 명확히 가르치며 자립심을 길러주는 부모입니다.", points: ["규칙 중요시", "독립심 고취"] },
  water: { overview: "자녀의 감정에 공감하고 대화로 문제를 풀어가는 지혜로운 부모입니다.", points: ["풍부한 감수성 교감", "열린 교육 방식"] }
};

const MATCH_TIMING = [
  { year: "2026", name: "신뢰와 안착의 해", desc: "미래에 대한 중요한 약속(결혼, 동업)을 실행하기 좋습니다." },
  { year: "2027", name: "자산 확장과 결실의 해", desc: "경제적인 기반을 탄탄히 다지고 성과를 이루어내기 좋습니다." },
  { year: "2025", name: "새로운 도약과 전환점", desc: "오래된 갈등을 털고 확신이 강해지며 새 환경으로 나아갑니다." }
];

const MATCH_RELATIONS = {
  same: { title: "친구처럼 편안하고 평등한 관계", element_match: "{my}과(와) {part}의 만남으로 가치관이 비슷해 통하는 공감대가 큽니다.", chemistry: "긴장이 풀리는 거울 같은 인연.", conflict: { mild: "다툼시 우리는 한 편임을 확인하세요.", spicy: "지기 싫어서 바닥까지 긁는 자존심 싸움." }, advice: { mild: ["예의 잃지 않기", "자존심 대결 피하기"], spicy: ["고집 좀 꺾기", "내로남불 지적질 멈추기"] }, final_verdict: { mild: "조금만 양보하면 든든한 소울메이트입니다.", spicy: "똥고집 꺾을 자신 없으면 1년 안에 파국입니다." } },
  produce: { title: "내가 챙겨주고 싶은 상생의 관계", element_match: "나의 기운({my})이 상대({part})를 돕는 구조. 베풀고 싶어집니다.", chemistry: "조건 없는 호감이 솟아나는 따뜻한 케미.", conflict: { mild: "서운함이 쌓일 수 있으니 감사 표현을 요청하세요.", spicy: "한 명은 퍼주고 한 명은 당연하게 아는 호구 관계." }, advice: { mild: ["상대가 스스로 하도록 지켜보기", "희생이라 생각하지 말기"], spicy: ["퍼주는 쪽은 호구짓 멈추기", "받는 쪽은 양심 챙기기"] }, final_verdict: { mild: "따뜻한 배려가 돋보이는 결합입니다.", spicy: "한 명 뼈 갈아서 배불리는 가스라이팅 위험 군입니다." } },
  produced: { title: "상대의 지원을 받는 이로운 관계", element_match: "상대({part})가 나({my})를 북돋아주는 구조. 위안을 받습니다.", chemistry: "기대고 싶은 보호막 같은 든든한 케미.", conflict: { mild: "간섭이 통제로 느껴질 수 있으니 영역을 설명하세요.", spicy: "사랑 명목하에 상대를 통제하려는 숨막히는 꼰대짓." }, advice: { mild: ["받는 것에만 익숙해지지 않기", "먼저 리드해보기"], spicy: ["다 널 위해서라는 핑계 대지 않기", "각자 인생 감당하기"] }, final_verdict: { mild: "나침반처럼 이끌어주는 귀인입니다.", spicy: "기생충처럼 살지 말고 의존성 버리세요." } },
  control: { title: "강한 끌림과 텐션의 정복 관계", element_match: "나({my})가 상대({part})를 통제하려는 묘한 긴장감.", chemistry: "자석처럼 끌리는 짜릿한 케미.", conflict: { mild: "내 방식대로 통제하려다 갈등이 생깁니다. 존중하세요.", spicy: "서로 목줄 쥐고 흔드는 권력 투쟁." }, advice: { mild: ["내 뜻대로 바꾸려 하지 않기", "동등하게 의견 조율하기"], spicy: ["개조하려는 통제욕 버리기", "서열 정리 멈추기"] }, final_verdict: { mild: "적절한 긴장감이 매력적인 스파크가 됩니다.", spicy: "누가 위인지 싸우다 너덜너덜해질 팔자입니다." } },
  controlled: { title: "긴장감을 주며 발전하는 자극제", element_match: "상대({part})가 나({my})를 올바른 길로 이끌어주는 구조.", chemistry: "긍정적인 성장의 케미.", conflict: { mild: "상대의 원칙이 압박으로 다가옵니다. 속도를 설명하세요.", spicy: "팩트 폭력으로 자존감 깎아내리는 관계." }, advice: { mild: ["지나치게 눈치보지 않기", "조언을 잔소리로 여기지 않기"], spicy: ["우월감 채우는 비열한 짓 멈추기", "현미경 들이대지 말기"] }, final_verdict: { mild: "서로 존중하면 완벽한 성장 파트너가 됩니다.", spicy: "상대방 깎아내리는 변태적 관계 되기 전 선 지키세요." } }
};

const DAILY_FORTUNES = {
  same: { title: { mild: "당당하게 나아가는 하루", spicy: "주변 사람 다 떠나는 고집불통의 날" }, desc: { mild: "직관을 믿고 밀어붙이는 것이 좋습니다.", spicy: "쓸데없는 자존심은 쓰레기통에 처박으세요." } },
  produce: { title: { mild: "활기찬 에너지로 숨은 능력을 발휘하는 날", spicy: "나대다가 망신 당하기 딱 좋은 날" }, desc: { mild: "표현력과 재치가 빛납니다.", spicy: "분위기 파악 못하고 입방정 떨지 마세요." } },
  control: { title: { mild: "바쁘게 움직여 결실을 맺는 날", spicy: "푼돈 좇다가 사람 잃는 날" }, desc: { mild: "현실적 감각이 예리해져 성과가 기대됩니다.", spicy: "눈앞 이익만 따지다 얄팍하단 소리 듣습니다." } },
  controlled: { title: { mild: "책임감 있는 태도로 신뢰를 얻는 날", spicy: "눈치 보다가 완벽하게 호구 잡히는 날" }, desc: { mild: "나의 가치를 증명할 기회입니다. 차분하게 대응하세요.", spicy: "거절 못하고 덤터기 씁니다. 아닌 건 아니라고 하세요." } },
  produced: { title: { mild: "휴식 속에서 지혜를 얻는 하루", spicy: "잡생각만 하다가 하루 날려먹는 날" }, desc: { mild: "한 템포 쉬어가며 생각을 정리하세요.", spicy: "시뮬레이션만 돌리지 말고 이불 박차고 일어나세요." } }
};

const getTenDeity = (myElem, targetElem) => {
  if (myElem === targetElem) return { id: 'same', name: '비겁(比劫)' }; 
  if ((myElem === 'wood' && targetElem === 'fire') || (myElem === 'fire' && targetElem === 'earth') || (myElem === 'earth' && targetElem === 'metal') || (myElem === 'metal' && targetElem === 'water') || (myElem === 'water' && targetElem === 'wood')) return { id: 'produce', name: '식상(食傷)' }; 
  if ((myElem === 'wood' && targetElem === 'earth') || (myElem === 'fire' && targetElem === 'metal') || (myElem === 'earth' && targetElem === 'water') || (myElem === 'metal' && targetElem === 'wood') || (myElem === 'water' && targetElem === 'fire')) return { id: 'control', name: '재성(財星)' }; 
  if ((targetElem === 'wood' && myElem === 'earth') || (targetElem === 'fire' && myElem === 'metal') || (targetElem === 'earth' && myElem === 'water') || (targetElem === 'metal' && myElem === 'wood') || (targetElem === 'water' && myElem === 'fire')) return { id: 'controlled', name: '관성(官星)' }; 
  return { id: 'produced', name: '인성(印星)' }; 
};

const DAEUN_DICT = {
  same: {
    3: { keyword: "독립과 경쟁", desc: { mild: "자립심이 강해지는 시기.", spicy: "근거없는 자신감으로 피곤한 시기." }, type: "neutral" },
    4: { keyword: "협력과 주관", desc: { mild: "돌파력이 들어옵니다.", spicy: "사람 믿다가 뒤통수 맞는 시기." }, type: "warning" },
    5: { keyword: "권한과 리더십", desc: { mild: "조직을 이끄는 확고한 시기.", spicy: "본인이 왕인줄 착각하는 시기." }, type: "good" },
    6: { keyword: "명예와 2막", desc: { mild: "인생 2막의 판을 짭니다.", spicy: "라떼는 말이야 시전하다 고립됨." }, type: "neutral" }
  },
  produce: {
    3: { keyword: "진로 개척", desc: { mild: "재능을 적극적으로 알리는 시기.", spicy: "이것저것 찔러보다 시간 버림." }, type: "good" },
    4: { keyword: "성과와 확장", desc: { mild: "성과로 연결되어 바빠집니다.", spicy: "돈 벌었다고 설치다 무너짐." }, type: "good" },
    5: { keyword: "혁신과 소모", desc: { mild: "체력 소모가 큽니다.", spicy: "일중독으로 몸 망가짐." }, type: "warning" },
    6: { keyword: "여유와 후학", desc: { mild: "후학 양성하기 좋습니다.", spicy: "입만 살아 잔소리 폭격기 됨." }, type: "neutral" }
  },
  control: {
    3: { keyword: "경제적 감각", desc: { mild: "금전적 목표가 뚜렷해집니다.", spicy: "돈만 좇다 사람 잃는 시기." }, type: "good" },
    4: { keyword: "재물 축적기", desc: { mild: "금전적 보상으로 돌아오는 황금기.", spicy: "사치 부리다 10년 고생 한방에 감." }, type: "good" },
    5: { keyword: "자산의 확장", desc: { mild: "규모가 크게 확장됩니다.", spicy: "투자하는 순간 계좌 녹아내림." }, type: "warning" },
    6: { keyword: "풍요와 안정", desc: { mild: "여유를 높이는 시기입니다.", spicy: "노욕에 사기 당하기 딱 좋은 운." }, type: "good" }
  },
  controlled: {
    3: { keyword: "소속과 인정", desc: { mild: "조직의 인정을 받습니다.", spicy: "스스로 족쇄 차고 노예가 됨." }, type: "good" },
    4: { keyword: "책임과 압박", desc: { mild: "권한만큼 책임과 스트레스가 큽니다.", spicy: "총알받이 돼 화병 남." }, type: "warning" },
    5: { keyword: "사회적 명성", desc: { mild: "대체 불가한 핵심 리더.", spicy: "명예 좇다 실속 못 챙김." }, type: "good" },
    6: { keyword: "공로와 자문", desc: { mild: "명예로운 자리에서 자문합니다.", spicy: "과거 영광 취해 꼰대 취급 받음." }, type: "neutral" }
  },
  produced: {
    3: { keyword: "공인과 자격", desc: { mild: "문서와 배움의 운이 강합니다.", spicy: "쓸데없는 자격증만 수집함." }, type: "neutral" },
    4: { keyword: "문서와 귀인", desc: { mild: "귀인의 조력이나 계약 운이 따름.", spicy: "캥거루처럼 남에게 의존함." }, type: "good" },
    5: { keyword: "지적 자산", desc: { mild: "특허 등 지적 자산으로 수익 창출.", spicy: "생각만 하고 행동 안하는 시기." }, type: "neutral" },
    6: { keyword: "자산 시스템", desc: { mild: "부동산 등 안정적 시스템 완성.", spicy: "사람들과 단절되어 고립됨." }, type: "good" }
  }
};

const calculateDaeunNum = (birthDateStr, isForward) => {
  const bDate = new Date(birthDateStr);
  const d = bDate.getDate();
  let daysDiff = isForward ? (d < 6 ? 6 - d : 30 - d + 6) : (d >= 6 ? d - 6 : d + 30 - 6);
  let daeunNum = Math.round(daysDiff / 3) || 1;
  return daeunNum > 10 ? 10 : daeunNum;
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
    const sIdx = (mStemIdx + (step * direction) + 10) % 10;
    const bIdx = (mBranchIdx + (step * direction) + 12) % 12;
    const startAge = daeunNum + ((step - 1) * 10);
    const deityObj = getTenDeity(myElem, JIJI[bIdx].element);
    const dict = DAEUN_DICT[deityObj.id][step];

    result.push({
      age: `${startAge}~${startAge + 9}세`,
      startAge,
      period: `${CHEONGAN[sIdx].kor}${JIJI[bIdx].kor}(${CHEONGAN[sIdx].char}${JIJI[bIdx].char}) 대운 - ${deityObj.name}`,
      keyword: dict.keyword,
      desc: dict.desc, type: dict.type, score: dict.type === 'good' ? 90 : dict.type === 'warning' ? 45 : 70
    });
  }
  return result;
};

const YEARLY_POOLS = [
  {
    title: "크게 도약하거나, 변화를 맞이하는 승부의 해", 
    summary: { mild: "나의 역할이 커지는 도약의 시기입니다.", spicy: "뼈 빠지게 고생하고 책임만 잔뜩 떠안는 환장할 시기입니다." },
    keywords: ["책임 증가", "규모 확대", "실력 입증"],
    career: { good: ["새로운 프로젝트 리드", "승진/이직"], bad: ["무리한 확장", "구설수"] },
    wealth: { in: ["전문성 수익 증가", "새로운 계약"], out: ["체면 유지 지출", "스트레스 비용"] },
    quarters: [
      { q: "Q1", title: "준비 (1~3월)", desc: { mild: "방향성을 설정하는 시기.", spicy: "요행 바라지 말고 기본기나 닦으세요." } },
      { q: "Q2", title: "실행 (4~6월)", desc: { mild: "눈코 뜰 새 없이 바빠집니다.", spicy: "남 똥 치워주다 과로사합니다." } },
      { q: "Q3", title: "텐션 최고조 (7~9월)", desc: { mild: "에너지가 정점에 달합니다.", spicy: "성질 꾹 누르세요." } },
      { q: "Q4", title: "수확 (10~12월)", desc: { mild: "영역을 안정적으로 확장합니다.", spicy: "일찍 샴페인 터뜨리다 손가락 빱니다." } }
    ],
    core_advice: {
      mild: ["기존 역량을 어필하세요.", "중요 약속은 문서로 남기세요.", "체력 관리가 핵심입니다."],
      spicy: "알량한 능력만 믿다 뒤통수 맞습니다. 달콤하게 접근하는 흡혈귀들을 조심하고 억울해도 바보처럼 엎드려 있는 것만이 살아남는 길입니다."
    }
  },
  {
    title: "차곡차곡 내실 다지며 안정으로 접어드는 해", 
    summary: { mild: "시스템화하여 온전히 내 것으로 굳히는 시기입니다.", spicy: "대단한 거 해보겠다고 깝치지 말고 하던 거나 똑바로 지키세요." },
    keywords: ["내실 다지기", "문서 운", "휴식과 충전"],
    career: { good: ["업무 효율화", "자격증 취득"], bad: ["충동적 이직", "생소한 도전"] },
    wealth: { in: ["고정 수익 증가", "문서 관련 이득"], out: ["기기 수리비", "건강 지출"] },
    quarters: [
      { q: "Q1", title: "재정비 (1~3월)", desc: { mild: "워밍업을 하는 시기입니다.", spicy: "번아웃 핑계 그만 대고 앉으세요." } },
      { q: "Q2", title: "정리 (4~6월)", desc: { mild: "삶의 무게를 가볍게 만드세요.", spicy: "에너지 갉아먹는 관계 쳐내세요." } },
      { q: "Q3", title: "학습 (7~9월)", desc: { mild: "내공이 훌쩍 성장합니다.", spicy: "생존 무기 하나 만드세요." } },
      { q: "Q4", title: "수확 (10~12월)", desc: { mild: "안정적인 수확이 따릅니다.", spicy: "성과 났다고 우쭐대다 사기꾼 꼬입니다." } }
    ],
    core_advice: {
      mild: ["방어하고 지킬 때입니다.", "달콤한 투자 권유 조심하세요.", "배운 지식이 내년 무기가 됩니다."],
      spicy: "생존과 방어의 해입니다. 직관력 최악이니 대박 망상 버리세요. 자존심 내세워 퇴사나 투자하는 순간 지옥문 열립니다."
    }
  }
];

const getHash = (str) => Math.abs(str.split('').reduce((hash, char) => (Math.imul(31, hash) + char.charCodeAt(0)) | 0, 0));

const calculateRealSaju = (dateStr, timeStr, calendarType) => {
  let targetDate = new Date(`${dateStr}T00:00:00`);
  if (calendarType === 'lunar') targetDate.setDate(targetDate.getDate() + 29);
  
  const y = targetDate.getFullYear();
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();

  let sajuYear = m === 1 || (m === 2 && d < 4) ? y - 1 : y;
  const yStem = (sajuYear - 4 + 10) % 10;
  const yBranch = (sajuYear - 4 + 12) % 12;

  let sajuMonth = d < 5 ? m - 1 : m;
  if (sajuMonth === 0) sajuMonth = 12;
  const mBranch = sajuMonth === 1 ? 1 : (sajuMonth === 12 ? 0 : sajuMonth);
  const mStem = ([2, 4, 6, 8, 0][yStem % 5] + (sajuMonth - 2 + 12) % 12) % 10;

  const daysDiff = Math.round((new Date(y, m - 1, d) - new Date(2000, 0, 1)) / 86400000);
  const dStem = (4 + daysDiff + 10000) % 10;
  const dBranch = (6 + daysDiff + 10000) % 12;

  let hStem = -1, hBranch = -1;
  if (timeStr !== 'unknown') {
    hBranch = Math.floor(((parseInt(timeStr.split(':')[0], 10) + 1) % 24) / 2); 
    hStem = ([0, 2, 4, 6, 8][dStem % 5] + hBranch) % 10;
  }

  return {
    year: { stem: CHEONGAN[yStem], branch: JIJI[yBranch] },
    month: { stem: CHEONGAN[mStem], branch: JIJI[mBranch] },
    day: { stem: CHEONGAN[dStem], branch: JIJI[dBranch] },
    hour: timeStr !== 'unknown' ? { stem: CHEONGAN[hStem], branch: JIJI[hBranch] } : { stem: { char: '?', kor: '모름', element: 'metal' }, branch: { char: '?', kor: '모름', element: 'metal' } }
  };
};

const countElements = (pillars) => {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  Object.values(pillars).forEach(p => {
    if(p.stem.element && p.stem.char !== '?') counts[p.stem.element]++;
    if(p.branch.element && p.branch.char !== '?') counts[p.branch.element]++;
  });
  return counts;
};

const getNeededElement = (counts, primaryElem) => {
  const elems = ['wood', 'fire', 'earth', 'metal', 'water'];
  const lacks = elems.filter(e => counts[e] === 0);
  if (lacks.length > 0) return lacks[0]; 
  const excesses = elems.filter(e => counts[e] >= 3);
  if (excesses.length > 0) return { wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth' }[excesses[0]]; 
  return { wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal' }[primaryElem];
};

const calculateSinsal = (pillars, hash) => {
  const res = [];
  const db = pillars.day.branch.char, yb = pillars.year.branch.char, dsb = pillars.day.stem.char + db;
  if(['子','午','卯','酉'].includes(db) || ['子','午','卯','酉'].includes(yb) || hash%5===0) res.push('도화');
  if(['寅','申','巳','亥'].includes(db) || ['寅','申','巳','亥'].includes(yb) || hash%5===1) res.push('역마');
  if(['辰','戌','丑','未'].includes(db) || ['辰','戌','丑','未'].includes(yb) || hash%5===2) res.push('화개');
  if(['甲辰','乙未','丙戌','丁丑','戊辰','壬戌','癸丑'].includes(dsb) || hash%7===3) res.push('백호');
  if(['庚辰','庚戌','壬辰','壬戌','戊戌'].includes(dsb) || hash%7===4) res.push('괴강');
  if(res.length===0) res.push(['도화','역마','화개'][hash%3]);
  return Array.from(new Set(res)).slice(0, 3).map(k => SINSAL_DATA[k]);
};

const generateSajuProfile = (formData, flavorMode) => {
  const name = formData.name === '나(본인)' ? '회원' : formData.name;
  const hash = getHash(formData.name + formData.birthDate);
  const pillars = calculateRealSaju(formData.birthDate, formData.birthTime, formData.calendar);
  const pElem = pillars.day.stem.element, sElem = pillars.month.branch.element; 
  const counts = countElements(pillars);
  const elems = ['wood', 'fire', 'earth', 'metal', 'water'];
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const lacks = elems.filter(e => counts[e] === 0);
  const excesses = elems.filter(e => counts[e] >= 3);
  const neededElem = getNeededElement(counts, pElem);

  const points = [{ title: `${ELEMENTS[pElem].name}의 핵심 성향`, desc: ELEMENT_TRAITS[pElem].desc[flavorMode] }];
  if (pElem !== sElem) {
    points.push({ title: `${ELEMENTS[sElem].name}의 보조 성향`, desc: ELEMENT_TRAITS[sElem].desc[flavorMode] });
    points.push({ title: "시너지", desc: flavorMode === 'spicy' ? "기운 충돌로 변덕쟁이 취급을 받습니다." : "결합되어 매력적인 인상을 줍니다." });
  } else {
    points.push({ title: "강한 단일 기운", desc: flavorMode === 'spicy' ? "기운이 쓸데없이 강한 고집불통입니다." : "성향이 뚜렷하고 돌파력이 뛰어납니다." });
  }

  return {
    pillars,
    profile: {
      sinsal: calculateSinsal(pillars, hash),
      overall: {
        title: pElem !== sElem ? `${ELEMENTS[pElem].name}·${ELEMENTS[sElem].name}의 사주` : `강렬한 ${ELEMENTS[pElem].name}의 사주`,
        description: flavorMode === 'spicy' ? `${name}님은 '${ELEMENT_TRAITS[pElem].keyword}' 기질을 무조건 밀어붙이는 아집을 경계하세요.` : `${name}님은 '${ELEMENT_TRAITS[pElem].keyword}'을 무기로 성취를 이룹니다.`,
        points
      },
      elemDistribution: {
        counts, total,
        lacks: lacks.map(e => ({ name: ELEMENTS[e].name, desc: ELEMENT_ANALYSIS[e].lack[flavorMode], color: ELEMENTS[e].color, bg: ELEMENTS[e].bg })),
        excesses: excesses.map(e => ({ name: ELEMENTS[e].name, desc: ELEMENT_ANALYSIS[e].excess[flavorMode], color: ELEMENTS[e].color, bg: ELEMENTS[e].bg })),
        balancedMsg: lacks.length===0 && excesses.length===0 ? "오행이 골고루 잘 갖춰진 안정적 사주입니다." : null
      },
      personality: {
        strengths: Array.from(new Set([ELEMENT_TRAITS[pElem].strength, ELEMENT_TRAITS[sElem].strength, "묵직한 책임감"])),
        weaknesses: Array.from(new Set([ELEMENT_TRAITS[pElem].weakness[flavorMode], ELEMENT_TRAITS[sElem].weakness[flavorMode], flavorMode==='spicy'?"내탓 합리화":"워커홀릭"]))
      },
      daeun: generateDaeunFlow(pillars, formData.gender, formData.birthDate), 
      luckySolution: {
        elementName: ELEMENTS[neededElem].name, color: ELEMENTS[neededElem].color, bg: ELEMENTS[neededElem].bg, data: LUCKY_SOLUTIONS[neededElem],
        reason: flavorMode === 'spicy' ? `결함을 때우기 위한 처방입니다. '${ELEMENTS[neededElem].name}' 소품을 보고 고집 좀 꺾으세요.` : `가장 필요한 '${ELEMENTS[neededElem].name}'을 채워 긍정적인 맞춤 행운 가이드입니다.`
      },
      career: CAREER_TRAITS[pElem], wealth: { overview: WEALTH_TRAITS[pElem].overview, good: WEALTH_TRAITS[pElem].good, bad: WEALTH_TRAITS[pElem].bad[flavorMode] },
      relationship: { overview: REL_TRAITS[pElem].overview, spouse: REL_TRAITS[pElem].spouse, tips: REL_TRAITS[pElem].tips[flavorMode] },
      children: CHILDREN_TRAITS[pElem], health: { overview: HEALTH_TRAITS[pElem].overview[flavorMode], points: HEALTH_TRAITS[pElem].points[flavorMode] },
      yearly: YEARLY_POOLS[hash % 2]
    }
  };
};

const generateDailyProfile = (formData, flavorMode) => {
  const hash = getHash(formData.name + formData.birthDate + new Date().toDateString());
  const primaryElem = calculateRealSaju(formData.birthDate, formData.birthTime, formData.calendar).day.stem.element;
  const todayElem = calculateRealSaju(new Date().toISOString().split('T')[0], 'unknown', 'solar').day.stem.element;
  const deity = getTenDeity(primaryElem, todayElem);
  const scoreBase = 70 + (hash % 20);
  const selType = DAILY_FORTUNES[deity.id];
  
  return {
    total: { title: selType.title[flavorMode], desc: selType.desc[flavorMode] },
    scores: { love: Math.min(98, scoreBase+(hash%5)), wealth: Math.min(98, scoreBase+((hash+2)%6)), health: Math.min(98, scoreBase+((hash+4)%7)) },
    timeFlow: [
      { time: "오전 (06~12시)", icon: Sunrise, color: "text-amber-400", bgIcon: "bg-amber-500/20", borderColor: "border-amber-500/30", desc: flavorMode==='spicy'?"딴짓 없이 제일 중요한 일부터 쳐내세요.":"중요한 결정이나 연락은 오전에 집중하세요." },
      { time: "오후 (12~18시)", icon: Sun, color: "text-rose-400", bgIcon: "bg-rose-500/20", borderColor: "border-rose-500/30", desc: flavorMode==='spicy'?"쓸데없는 논쟁 피하고 입 닫고 하던 일 하세요.":"조급해하지 말고 상대방 말에 귀 기울이세요." },
      { time: "저녁 (18시 이후)", icon: Moon, color: "text-indigo-400", bgIcon: "bg-indigo-500/20", borderColor: "border-indigo-500/30", desc: flavorMode==='spicy'?"야식 먹지 말고 일찍 자는게 답입니다.":"따뜻한 휴식을 가져보세요." }
    ],
    luckyItems: [
      { label: "행운 색상", value: ["네이비","버건디","화이트","블랙"][hash%4], icon: Palette, color: "text-blue-400", bg: "bg-blue-500/10" },
      { label: "행운 숫자", value: ["3,7","2,8","1,9"][hash%3], icon: Hash, color: "text-amber-400", bg: "bg-amber-500/10" },
      { label: "행운 물건", value: ["손수건","향수","화분"][hash%3], icon: Coffee, color: "text-rose-400", bg: "bg-rose-500/10" },
      { label: "오늘 길방", value: (hash%2===0)?"남동쪽":"북서쪽", icon: Compass, color: "text-emerald-400", bg: "bg-emerald-500/10" }
    ],
    doAndDont: {
      do: flavorMode === 'spicy' ? ["핑계대지 말고 실행하기"] : ["주변 정리정돈 하기"],
      dont: flavorMode === 'spicy' ? ["아는 척 남 가르치기"] : ["감정에 휩쓸려 결정하기"]
    },
    relationship: {
      good: { title: "오늘의 귀인", desc: flavorMode === 'spicy' ? "팩폭 날려줄 현실주의자를 곁에 두세요." : "공감해주고 객관적인 조언을 건네는 사람." },
      bad: { title: "주의할 인연", desc: flavorMode === 'spicy' ? "불평불만러를 절대 피하세요." : "본인 감정만 앞세우는 사람을 피하세요." }
    }
  };
};

const generateMatchProfile = (myFormData, partnerFormData, flavorMode) => {
  const hash = getHash(myFormData.name + partnerFormData.name + myFormData.birthDate);
  const myPills = calculateRealSaju(myFormData.birthDate, myFormData.birthTime, myFormData.calendar);
  const pPills = calculateRealSaju(partnerFormData.birthDate, partnerFormData.birthTime, partnerFormData.calendar);
  const mElem = myPills.day.stem.element, pElem = pPills.day.stem.element;
  const rel = getTenDeity(mElem, pElem);
  const matchData = MATCH_RELATIONS[rel.id];
  const score = Math.min(99, (rel.id==='same'?82:rel.id.includes('produce')?88:74) + (hash%12)); 

  return {
    myPillars: myPills, partnerPillars: pPills,
    profile: {
      score, title: matchData.title,
      summary: flavorMode === 'spicy' ? `[${rel.name}]의 굴레로 엮여있어 단점을 똑바로 파악해야 합니다.` : `[${rel.name}]의 관계로 서로 깊은 영향을 줍니다.`,
      element_match: { title: `${ELEMENTS[mElem].name}과 ${ELEMENTS[pElem].name}의 만남`, desc: matchData.element_match.replace('{my}', ELEMENTS[mElem].name).replace('{part}', ELEMENTS[pElem].name) },
      complement_rate: { score: Math.min(98, 75+(hash%15)), desc: "다름을 인정할 때 시너지가 큽니다." },
      details: [
        { category: "연인 궁합", icon: Heart, score: Math.min(99, score+(hash%3)), color: "text-rose-400", bg: "bg-rose-950/30" },
        { category: "동업 궁합", icon: Coins, score: Math.max(60, score-5+(hash%7)), color: "text-amber-400", bg: "bg-amber-950/30" }
      ],
      conflict_resolution: { my_trait: ELEMENT_TRAITS[mElem].keyword, partner_trait: ELEMENT_TRAITS[pElem].keyword, solution: matchData.conflict[flavorMode] },
      secret_chemistry: { title: "보이지 않는 영향력", desc: matchData.chemistry },
      best_timing: MATCH_TIMING[hash % 3], advice: matchData.advice[flavorMode], final_verdict: matchData.final_verdict[flavorMode]
    }
  };
};

// UI 컴포넌트
const PillarBox = ({ title, data, isUnknown }) => {
  if (isUnknown) return (
    <div className="flex flex-col items-center flex-1">
      <div className="text-xs text-slate-400 mb-1">{title}</div>
      <div className="w-full bg-slate-800 border border-slate-700/50 rounded-xl p-2 flex flex-col items-center justify-center gap-2 h-28"><span className="text-2xl text-slate-500">?</span><div className="w-full border-t border-slate-700/50 my-0.5"></div><span className="text-2xl text-slate-500">?</span></div>
    </div>
  );
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="text-xs text-slate-400 mb-1">{title}</div>
      <div className="w-full rounded-xl flex flex-col h-28 border border-slate-700/30">
        <div className={`flex-1 flex flex-col items-center justify-center ${ELEMENTS[data.stem.element].bg} border-b ${ELEMENTS[data.stem.element].border}`}><span className={`text-2xl font-bold ${ELEMENTS[data.stem.element].color}`}>{data.stem.char}</span><span className="text-[10px] text-slate-300">{data.stem.kor}</span></div>
        <div className={`flex-1 flex flex-col items-center justify-center ${ELEMENTS[data.branch.element].bg}`}><span className={`text-2xl font-bold ${ELEMENTS[data.branch.element].color}`}>{data.branch.char}</span><span className="text-[10px] text-slate-300">{data.branch.kor}</span></div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, flavorMode }) => (
  <div className="mb-4 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${flavorMode==='spicy'?'bg-rose-500/20':'bg-indigo-500/20'}`}><Icon className={`w-5 h-5 ${flavorMode==='spicy'?'text-rose-400':'text-indigo-400'}`} /></div>
    <h3 className="text-lg font-bold text-white">{title}</h3>
  </div>
);

const BulletList = ({ items, type="dot" }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
        {type==='check'&&<CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />}{type==='warn'&&<AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5" />}{type==='star'&&<Star className="w-4 h-4 text-amber-400 mt-0.5" />}{type==='dot'&&<span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />}
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const FlavorToggle = ({ flavorMode, setFlavorMode }) => (
  <div className="flex gap-3 mb-6 bg-slate-800 p-2 rounded-2xl border border-slate-700">
    <button type="button" onClick={() => setFlavorMode('mild')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex justify-center gap-2 ${flavorMode==='mild'?'bg-indigo-500 text-white':'text-slate-400'}`}>😌 순한맛 (조언)</button>
    <button type="button" onClick={() => setFlavorMode('spicy')} className={`flex-1 py-3 rounded-xl font-bold text-sm flex justify-center gap-2 ${flavorMode==='spicy'?'bg-rose-600 text-white':'text-slate-400'}`}>🔥 매운맛 (팩폭)</button>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); 
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [flavorMode, setFlavorMode] = useState('mild');

  const [formData, setFormData] = useState({ name: '', gender: 'male', calendar: 'solar', birthDate: '', birthTime: 'unknown' });
  const [partnerFormData, setPartnerFormData] = useState({ name: '', gender: 'female', calendar: 'solar', birthDate: '', birthTime: 'unknown' });
  
  const [sajuStep, setSajuStep] = useState('input'); const [sajuResult, setSajuResult] = useState(null);
  const [matchStep, setMatchStep] = useState('input'); const [matchResult, setMatchResult] = useState(null);
  const [dailyStep, setDailyStep] = useState('input'); const [dailyResult, setDailyResult] = useState(null);

  // --- OAuth 및 Firebase 연동 ---
  useEffect(() => {
    const handleOAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const kakaoCode = urlParams.get('code');
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const naverToken = hashParams.get('access_token');

      if (kakaoCode) {
        try {
          const redirectUri = window.location.origin;
          window.history.replaceState({}, document.title, window.location.pathname);
          const res = await fetch('https://kauth.kakao.com/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=authorization_code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&code=${kakaoCode}` });
          const tokenData = await res.json();
          const userRes = await fetch('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
          const userData = await userRes.json();
          await finishLogin({ id: `kakao_${userData.id}`, name: userData.properties?.nickname || '카카오 회원' });
        } catch(e) { 
          alert("소셜 로그인 연결 지연. 하단의 '비회원(게스트)으로 시작'을 이용해주세요."); 
        }
      } else if (naverToken) {
         window.history.replaceState({}, document.title, window.location.pathname);
         await finishLogin({ id: `naver_${naverToken.substring(0, 15)}`, name: '네이버 회원' });
      } else {
         const saved = localStorage.getItem('sajuUser');
         if (saved) { const u = JSON.parse(saved); setIsLoggedIn(true); setCurrentUser(u); fetchDb(u.id); }
      }
    };
    handleOAuth();
  }, []);

  const finishLogin = async (userInfo) => {
    localStorage.setItem('sajuUser', JSON.stringify(userInfo));
    setIsLoggedIn(true); setCurrentUser(userInfo);
    await fetchDb(userInfo.id);
    setActiveTab('home');
  };

  const fetchDb = async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists() && docSnap.data().profiles) setSavedProfiles(docSnap.data().profiles);
      else {
        const d = { id: Date.now(), name: '나(본인)', gender: 'male', calendar: 'solar', birthDate: '1990-01-01', birthTime: 'unknown', isMe: true };
        setSavedProfiles([d]);
        await setDoc(doc(db, 'users', userId), { profiles: [d] });
      }
    } catch(e) {}
  };

  const syncDb = async (p) => { if(currentUser) await setDoc(doc(db, 'users', currentUser.id), { profiles: p }, { merge: true }); };

  const loginClick = (provider) => {
    const r = window.location.origin;
    if (provider === 'kakao') window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${r}&response_type=code`;
    else window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&response_type=token&redirect_uri=${r}&state=sajulog`;
  };

  const handleLogout = () => { setIsLoggedIn(false); setCurrentUser(null); localStorage.removeItem('sajuUser'); setActiveTab('home'); };

  const guestLogin = async () => {
    await finishLogin({ id: `guest_${Date.now()}`, name: '게스트' });
  };

  // --- 렌더링 영역 ---
  if (!isLoggedIn) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0D14] text-white p-6">
      <Moon className="w-16 h-16 text-indigo-400 mb-6" />
      <h1 className="text-3xl font-bold mb-8">사주로그</h1>
      
      <button onClick={()=>loginClick('kakao')} className="w-full max-w-sm bg-[#FEE500] text-black font-bold py-4 rounded-xl mb-3 flex items-center justify-center gap-2"><MessageCircle /> 카카오 로그인</button>
      <button onClick={()=>loginClick('naver')} className="w-full max-w-sm bg-[#03C75A] text-white font-bold py-4 rounded-xl mb-4 flex items-center justify-center gap-2"><MessageSquare /> 네이버 로그인</button>
      
      <div className="w-full max-w-sm border-t border-slate-800 my-4"></div>
      
      <button onClick={guestLogin} className="w-full max-w-sm bg-slate-800 text-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
        <User className="w-5 h-5" /> 비회원(게스트)으로 시작
      </button>
      <p className="text-slate-500 text-xs mt-4 text-center leading-relaxed">※ 브라우저 보안 환경에 따라 소셜 로그인이<br/>지연될 수 있습니다. 우선 게스트 모드로 체험해보세요!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-200 font-sans pb-24">
      <nav className="fixed top-0 w-full bg-slate-900/80 p-4 flex justify-between items-center z-50 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-lg"><Moon className="text-indigo-400 w-5 h-5"/>사주로그</div>
        <button onClick={handleLogout} className="text-xs text-slate-400">로그아웃</button>
      </nav>

      <main className="pt-20 px-4 max-w-2xl mx-auto space-y-8">
        {activeTab === 'home' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">환영합니다, {currentUser.name}님!</h2>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={()=>{setActiveTab('daily');setDailyStep('input');}} className="bg-slate-800 p-6 rounded-2xl text-left"><Sun className="w-8 h-8 text-amber-400 mb-2"/><h3 className="font-bold">오늘운세</h3></button>
               <button onClick={()=>{setActiveTab('saju');setSajuStep('input');}} className="bg-slate-800 p-6 rounded-2xl text-left"><BookOpen className="w-8 h-8 text-indigo-400 mb-2"/><h3 className="font-bold">프리미엄 사주</h3></button>
               <button onClick={()=>{setActiveTab('match');setMatchStep('input');}} className="bg-slate-800 p-6 rounded-2xl text-left col-span-2"><Heart className="w-8 h-8 text-rose-400 mb-2"/><h3 className="font-bold">프리미엄 궁합</h3></button>
            </div>
          </div>
        )}

        {activeTab === 'saju' && sajuStep === 'input' && (
          <form onSubmit={(e)=>{e.preventDefault(); setSajuResult(generateSajuProfile(formData, flavorMode)); setSajuStep('result');}} className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
             <FlavorToggle flavorMode={flavorMode} setFlavorMode={setFlavorMode} />
             <div className="space-y-4">
               <input type="text" placeholder="이름" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl" required/>
               <input type="date" value={formData.birthDate} onChange={e=>setFormData({...formData,birthDate:e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl" required/>
               <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">사주 분석하기</button>
             </div>
          </form>
        )}

        {activeTab === 'saju' && sajuStep === 'result' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-indigo-500/30">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">{formData.name}님의 사주 분석</h2>
            <div className="flex gap-2 mb-6"><PillarBox title="년주" data={sajuResult.pillars.year}/><PillarBox title="월주" data={sajuResult.pillars.month}/><PillarBox title="일주" data={sajuResult.pillars.day}/></div>
            <SectionHeader icon={Star} title={sajuResult.profile.overall.title} flavorMode={flavorMode} />
            <p className="text-slate-300 leading-relaxed mb-6">{sajuResult.profile.overall.description}</p>
            <button onClick={()=>setSajuStep('input')} className="w-full bg-slate-800 p-4 rounded-xl font-bold text-white">다시 입력하기</button>
          </div>
        )}

        {activeTab === 'daily' && dailyStep === 'input' && (
           <form onSubmit={(e)=>{e.preventDefault(); setDailyResult(generateDailyProfile(formData, flavorMode)); setDailyStep('result');}} className="bg-slate-900 p-6 rounded-2xl">
             <FlavorToggle flavorMode={flavorMode} setFlavorMode={setFlavorMode} />
             <input type="date" value={formData.birthDate} onChange={e=>setFormData({...formData,birthDate:e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl mb-4" required/>
             <button type="submit" className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl">운세 보기</button>
           </form>
        )}

        {activeTab === 'daily' && dailyStep === 'result' && (
           <div className="bg-slate-900 p-6 rounded-3xl border border-amber-500/30 text-center">
             <Sun className="w-12 h-12 text-amber-400 mx-auto mb-4" />
             <h2 className="text-xl font-bold mb-4">{dailyResult.total.title}</h2>
             <p className="text-slate-300 mb-6">{dailyResult.total.desc}</p>
             <button onClick={()=>setDailyStep('input')} className="w-full bg-slate-800 p-4 rounded-xl font-bold">뒤로가기</button>
           </div>
        )}
        
        {activeTab === 'match' && matchStep === 'input' && (
           <form onSubmit={(e)=>{e.preventDefault(); setMatchResult(generateMatchProfile(formData, partnerFormData, flavorMode)); setMatchStep('result');}} className="bg-slate-900 p-6 rounded-2xl">
             <FlavorToggle flavorMode={flavorMode} setFlavorMode={setFlavorMode} />
             <h3 className="font-bold text-rose-400 mb-2">나의 생일</h3>
             <input type="date" value={formData.birthDate} onChange={e=>setFormData({...formData,birthDate:e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl mb-4" required/>
             <h3 className="font-bold text-rose-400 mb-2">상대 생일</h3>
             <input type="date" value={partnerFormData.birthDate} onChange={e=>setPartnerFormData({...partnerFormData,birthDate:e.target.value})} className="w-full bg-slate-800 p-3 rounded-xl mb-4" required/>
             <button type="submit" className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl">궁합 보기</button>
           </form>
        )}

        {activeTab === 'match' && matchStep === 'result' && (
           <div className="bg-slate-900 p-6 rounded-3xl border border-rose-500/30 text-center">
             <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-white mb-2">궁합 점수: {matchResult.profile.score}점</h2>
             <p className="text-rose-300 font-bold mb-4">{matchResult.profile.title}</p>
             <p className="text-slate-300 mb-6">{matchResult.profile.summary}</p>
             <button onClick={()=>setMatchStep('input')} className="w-full bg-slate-800 p-4 rounded-xl font-bold">뒤로가기</button>
           </div>
        )}
      </main>

      <div className="fixed bottom-0 w-full bg-slate-900/90 border-t border-slate-800 p-2 flex justify-around">
         <button onClick={()=>setActiveTab('home')} className={`p-2 ${activeTab==='home'?'text-indigo-400':'text-slate-500'}`}><Home/></button>
         <button onClick={()=>{setActiveTab('daily');setDailyStep('input');}} className={`p-2 ${activeTab==='daily'?'text-amber-400':'text-slate-500'}`}><Sun/></button>
         <button onClick={()=>{setActiveTab('saju');setSajuStep('input');}} className={`p-2 ${activeTab==='saju'?'text-indigo-400':'text-slate-500'}`}><BookOpen/></button>
         <button onClick={()=>{setActiveTab('match');setMatchStep('input');}} className={`p-2 ${activeTab==='match'?'text-rose-400':'text-slate-500'}`}><Heart/></button>
      </div>
    </div>
  );
}
