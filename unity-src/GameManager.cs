using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public GridManager gridManager;
    public ActivePiece activePiece;
    public Text scoreText;
    public Text levelText;
    public Text rowsText;
    public GameObject gameOverPanel;

    private int score;
    private int rows;
    private int level;
    private float dropTime = 1f;

    private void Start()
    {
        // Find references if not assigned
        if (!gridManager) gridManager = FindObjectOfType<GridManager>();
        if (!activePiece) activePiece = FindObjectOfType<ActivePiece>();

        // Init Game
        score = 0;
        rows = 0;
        level = 0;
        UpdateUI();
        
        if (gameOverPanel) gameOverPanel.SetActive(false);

        SpawnNext();
    }

    public void PieceLocked(int rowsCleared)
    {
        // Calculate Score
        if (rowsCleared > 0)
        {
            int[] linePoints = { 40, 100, 300, 1200 };
            score += linePoints[rowsCleared - 1] * (level + 1);
            rows += rowsCleared;
            
            // Level up every 10 rows
            if (rows > (level + 1) * 10)
            {
                level++;
                dropTime = Mathf.Max(0.1f, 1f - (level * 0.1f)); // Speed up
                activePiece.stepDelay = dropTime;
            }
            
            UpdateUI();
        }

        SpawnNext();
    }

    private void SpawnNext()
    {
        if (activePiece == null) return;

        // Get random shape
        Tetromino randomShape = (Tetromino)Random.Range(0, 7);
        TetrominoData data = new TetrominoData();
        data.tetromino = randomShape;
        data.Initialize(); // Load cells and wallkicks from Data

        // Spawn at top center (assuming 12 width, center is 6, height 20)
        Vector3Int spawnPos = new Vector3Int(6, 18, 0); 
        
        // Check Game Over before spawning
        if (!gridManager.IsValidPosition(new Vector2Int(spawnPos.x, spawnPos.y)))
        {
            GameOver();
            return;
        }

        activePiece.SpawnNewPiece(data);
    }

    private void GameOver()
    {
        Debug.Log("Game Over");
        if (gameOverPanel) gameOverPanel.SetActive(true);
        if (activePiece) activePiece.gameObject.SetActive(false);
    }

    public void RestartGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }

    private void UpdateUI()
    {
        if (scoreText) scoreText.text = "Score: " + score;
        if (levelText) levelText.text = "Level: " + level;
        if (rowsText) rowsText.text = "Rows: " + rows;
    }
}
