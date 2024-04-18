import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, CardContent } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './Pomodoro.css'; 
import ringSound from '../../assets/ringSound.mp3'; 
import lofiMusic1 from '../../assets/lofiMusic1.mp3'; 
import lofiMusic2 from '../../assets/lofiMusic2.mp3'; 

const Pomodoro: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialMinutes, setInitialMinutes] = useState(25); 
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isMusicVisible, setIsMusicVisible] = useState(false); 
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); 
  const [selectedMusic, setSelectedMusic] = useState<HTMLAudioElement | null>(null); 
  const [musicFiles] = useState<HTMLAudioElement[]>([new Audio(lofiMusic1), new Audio(lofiMusic2)]); 

  const audio = new Audio(ringSound); // Create a new Audio instance

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            setIsTimeUp(true);
            setMinutes(initialMinutes); 
            setSeconds(0);
            audio.play(); 
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59); 
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, initialMinutes, audio]);

  const startTimer = (duration: number) => {
    setInitialMinutes(duration);
    setMinutes(duration);
    setSeconds(0);
    setIsActive(true);
    setIsTimeUp(false); 
  };

  const playMusic = (music: HTMLAudioElement) => {
    if (!music.paused) {
      music.currentTime = 0;
    } else {
      music.play();
      setIsMusicPlaying(true); 
    }
  };

  const pauseMusic = (music: HTMLAudioElement) => {
    music.pause(); 
    setIsMusicPlaying(false); 
  };

  const resetTimer = () => {
    setMinutes(initialMinutes); 
    setSeconds(0);
    setIsActive(false);
    setIsTimeUp(false); 
  };

  return (
    <div className="pomodoro-container">
      <div className="button-container">
        <Button variant="contained" onClick={() => startTimer(25)}>
          Pomodoro
        </Button>
        <Button variant="contained" onClick={() => startTimer(10)}>
          Long Break
        </Button>
        <Button variant="contained" onClick={() => startTimer(5)}>
          Short Break
        </Button>
      </div>
      <div className="timer-container">
        <div className="timer">
          <Typography variant="h3">
            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Typography>
          {isTimeUp && <div className="ring" />}
        </div>
      </div>
      <div className="button-container">
        <Button variant="contained" onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button variant="contained" onClick={resetTimer}>
          Reset
        </Button>
      </div>
      <div className="button-container" style={{ marginTop: '20px' }}>
        <Button variant="contained" onClick={() => setIsMusicVisible(!isMusicVisible)}>
          {isMusicVisible ? 'Hide Music' : 'Listen to Music'}
        </Button>
      </div>
      {isMusicVisible && (
        <div className="music-container">
          {musicFiles.map((music, index) => (
            <Card key={index} className="music-card" style={{ margin: '2rem' }}>
              <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom style={{ marginRight: '10rem' }}>
                  {`Music ${index + 1}`}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (selectedMusic !== music) {
                      setSelectedMusic(music);
                      playMusic(music);
                    } else {
                      if (isMusicPlaying) {
                        pauseMusic(music);
                      } else {
                        playMusic(music);
                      }
                    }
                  }}
                >
                  {isMusicPlaying && selectedMusic === music ? <PauseIcon /> : <PlayArrowIcon />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
