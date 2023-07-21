import { useEffect, useRef, useState } from 'react'
import styles from './App.module.scss'
import { CanvasController } from './CanvasController'

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const controllerRef = useRef<CanvasController | null>(null)
  const [result, setResult] = useState<{ error?: Error } | null>(null)

  const onComplete = (error?: Error) => {
    setResult({ error, })
  }

  useEffect(() => {
    if (canvasRef.current && !controllerRef.current) {
      const controller = new CanvasController(canvasRef.current)
      controller.setCallbacks(onComplete)
      controller.setup()
      controllerRef.current = controller
    }
  }, [canvasRef.current])

  return (
    <>
      <div>
        {result?.error && (
          <div className={styles.error}>
            {result.error.message}
          </div>
        )}
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </>
  )
}

export default App
