import { useSnake } from "../../context/SnakeContext";

const GameBoardHeader = () => {
  const { gameSound, setGameSound, userHighScore, userScore } = useSnake();

  return (
    <div className="scores flex min-h-[50px] w-full items-center justify-between border border-slate-500 p-2">
      {/* Back and sound controls */}

      <div className="flex items-center gap-6">
        <div
          className={`goBack w-10 cursor-pointer text-slate-200`}
          onClick={() => {}}
        >
          <svg
            viewBox="0 0 24 24"
            transform="rotate(90)"
            fill="none"
            className="w-full"
          >
            <path
              d="M12 4V18M12 18L7 13M12 18L17 13"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className={`soundControl w-8 cursor-pointer ${gameSound ? "text-slate-200" : "text-slate-600"}`}
          onClick={() => {
            setGameSound(!gameSound);
          }}
        >
          <svg viewBox="0 0 512 512" fill="currentColor">
            <g>
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                  fill="currentColor"
                  transform="translate(42.666667, 59.581722)"
                >
                  <path
                    d={
                      gameSound
                        ? "M361.299413,341.610667 L328.014293,314.98176 C402.206933,233.906133 402.206933,109.96608 328.013013,28.8906667 L361.298133,2.26304 C447.910187,98.97536 447.908907,244.898347 361.299413,341.610667 Z M276.912853,69.77216 L243.588693,96.4309333 C283.38432,138.998613 283.38304,204.87488 243.589973,247.44256 L276.914133,274.101333 C329.118507,215.880107 329.118507,127.992107 276.912853,69.77216 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 L191.749973,1.42108547e-14 Z"
                        : "M47.0849493,-1.42108547e-14 L298.668,251.583611 L304.101001,257.015597 L304.101,257.016 L353.573532,306.488791 C353.573732,306.488458 353.573933,306.488124 353.574133,306.48779 L384.435257,337.348961 L384.434,337.349 L409.751616,362.666662 L379.581717,392.836561 L191.749,205.003 L191.749973,369.105851 L81.0208,283.647505 L7.10542736e-15,283.647505 L7.10542736e-15,112.980838 L80.8957867,112.980838 L91.433,104.688 L16.9150553,30.169894 L47.0849493,-1.42108547e-14 Z M361.298133,28.0146513 C429.037729,103.653701 443.797162,209.394226 405.578884,298.151284 L372.628394,265.201173 C396.498256,194.197542 381.626623,113.228555 328.013013,54.642278 L361.298133,28.0146513 Z M276.912853,95.5237713 C305.539387,127.448193 318.4688,168.293162 315.701304,208.275874 L266.464558,159.040303 C261.641821,146.125608 254.316511,133.919279 244.488548,123.156461 L243.588693,122.182545 L276.912853,95.5237713 Z M191.749973,25.7516113 L191.749,84.3256113 L158.969,51.5456113 L191.749973,25.7516113 Z"
                    }
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Score and high score */}
      <div className="flex items-center gap-8">
        <div className="score w-8 bg-white">{userScore}</div>
        <div className="highScore w-8 bg-white">{userHighScore}</div>
      </div>
    </div>
  );
};
export default GameBoardHeader;
