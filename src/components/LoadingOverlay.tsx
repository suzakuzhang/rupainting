"use client";

import { useEffect, useState, useRef } from "react";

const LOADING_STATES = [
  "正走近这幅画……",
  "正在把画面证据组织成观看路径……",
  "正在生成解读……",
];

const COMMON_FACTS = [
  `读一幅中国画不是一眼看完——眼睛要按一条路径移动。`,
  `题跋和印章不是污损画面——它们是这幅画历经千年的传承痕迹。`,
  `郭熙《林泉高致》提出"三远"：高远、平远、深远，是理解山水构图的入口。`,
  `中国文人认为色彩会分散画作的"神"——所以水墨成为文人画的主要语言。`,
  `赵孟頫论文人画："写而非画"——把绘画当书法来书写。`,
  `留白不是"什么都没有"——是云、是水、是雾、是气、是不可言说。`,
  `八大山人画的鸟眼眶圆睁、眼珠上翻，这是他对世界的姿态。`,
  `《照夜白》画心仅 30cm 见方，因历代题跋使现存手卷有 6 米余长。`,
  `文人画与宫廷画的关键区别：是"以书入画的简笔"还是"用矿物颜料的精谨"。`,
  `何慕文："读一幅中国画就如同与历史对话。"`,
  `八大山人晚年常用"涉事"一词——涉尘而不沾不滞，禅家心境。`,
  `孤峰、孤鸟、孤鱼、孤荷——八大笔下"孤"的意象，是禅门"独立大雄峰"的图像翻译。`,
  `平远不是"看远的"——它强调的是水平方向的辽阔展开。`,
  `钤印是中国书画的独有特征——每一方印是一次"我看过"的声明。`,
  `画家的款署位置、字号、印章都参与构图——它们是画的一部分。`,
];

interface LoadingOverlayProps {
  visible: boolean;
  paintingTitle?: string;
}

export default function LoadingOverlay({ visible, paintingTitle }: LoadingOverlayProps) {
  const [stateText, setStateText] = useState(LOADING_STATES[0]);
  const [fact, setFact] = useState("");
  const [progress, setProgress] = useState(0);
  const factPool = useRef<string[]>([]);
  const factIndex = useRef(0);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }

    const pool = [...COMMON_FACTS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    factPool.current = pool;
    factIndex.current = 0;
    setFact(pool[0] ?? "");

    setStateText(LOADING_STATES[0]);
    const t1 = setTimeout(() => setStateText(LOADING_STATES[1]), 2000);
    const t2 = setTimeout(() => setStateText(LOADING_STATES[2]), 4500);

    const factInterval = setInterval(() => {
      factIndex.current = (factIndex.current + 1) % factPool.current.length;
      setFact(factPool.current[factIndex.current]);
    }, 3000);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(95, (1 - Math.exp(-elapsed / 10000)) * 100);
      setProgress(p);
    }, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, [visible, paintingTitle]);

  if (!visible) return null;

  return (
    <div className="space-y-4 py-4" aria-live="polite">
      <p className="text-sm text-[var(--muted)] animate-pulse">{stateText}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-[#1a1a1a] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-[var(--muted)] leading-relaxed min-h-[2.5rem] transition-opacity duration-500">
        {fact}
      </p>
    </div>
  );
}
