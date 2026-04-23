using UnityEngine;

public class ActivePiece : MonoBehaviour
{
    public GridManager gridManager;
    public Vector3Int spawnPosition; 
    public TetrominoData data;
    
    // Config
    public float stepDelay = 1f;
    public float lockDelay = 0.5f;
    public float moveDelay = 0.1f; // DAS delay if implemented, simplified here

    private float stepTime;
    private float lockTime;
    private float moveTime;

    public void Initialize(GridManager grid, Vector3Int spawnPos)
    {
        this.gridManager = grid;
        this.spawnPosition = spawnPos;
    }

    // We'll use a slightly different approach: GameManager calls SpawnNewPiece on this script
    // and this script reconstructs itself or the child blocks.
    
    // We'll use a slightly different approach: GameManager calls SpawnNewPiece on this script
    // and this script reconstructs itself or the child blocks.
    
    // Let's refine based on the plan:
    // This script is attached to a GameObject that represents the falling piece.
    // CHILDREN of this GameObject are the blocks.
    
    public void SpawnNewPiece(TetrominoData data)
    {
        this.data = data;
        this.data.Initialize();
        
        transform.position = spawnPosition;
        transform.rotation = Quaternion.identity;
        
        // Clear old children if any (reusing object)
        foreach (Transform child in transform) {
            Destroy(child.gameObject);
        }

        // Spawn blocks
        for (int i = 0; i < this.data.cells.Length; i++)
        {
            Vector3 cellPos = (Vector3)(Vector3Int)this.data.cells[i];
            
            // Create a Cube
            GameObject block = GameObject.CreatePrimitive(PrimitiveType.Cube);
            block.transform.parent = transform;
            block.transform.localPosition = cellPos;
            
            // Set Color
            var renderer = block.GetComponent<Renderer>();
            renderer.material.color = Data.Colors[this.data.tetromino];
            
            // Optimization: Remove collider from child blocks so they don't interfere with raycasts if we used them
            // But we use grid logic, so it's fine.
        }

        stepTime = Time.time + stepDelay;
        lockTime = 0f;
    }

    private void Update()
    {
        if (gridManager == null) return;

        // Reset locking if we move
        bool inputMoved = false;

        // Movement
        if (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.LeftArrow))
        {
            if (Move(Vector2Int.left)) inputMoved = true;
        }
        else if (Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.RightArrow))
        {
            if (Move(Vector2Int.right)) inputMoved = true;
        }
        else if (Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.DownArrow))
        {
            if (Move(Vector2Int.down)) inputMoved = true;
        }

        // Rotation
        if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.UpArrow))
        {
            if (Rotate(1)) inputMoved = true; // Rotate Clockwise
        }

        // Hard Drop
        if (Input.GetKeyDown(KeyCode.Space))
        {
            HardDrop();
        }

        if (inputMoved)
        {
            // Reset lock timer if we moved successfully? 
            // Classic Tetris resets on successful movement/rotation if grounded.
            // Simplified: won't reset excessively.
            lockTime = 0f;
        }

        // Automatic Step
        if (Time.time > stepTime)
        {
            Step();
        }
    }

    private void Step()
    {
        stepTime = Time.time + stepDelay;

        // Try move down
        if (!Move(Vector2Int.down))
        {
            // If failed to move down, we might be landing
            Lock();
        }
    }

    private void HardDrop()
    {
        while (Move(Vector2Int.down))
        {
            // Continue until hit
        }
        Lock();
    }

    private void Lock()
    {
        gridManager.AddToGrid(transform);
        int cleared = gridManager.ClearLines();
        
        // Notify GameManager (FindObject or Event)
        FindObjectOfType<GameManager>().PieceLocked(cleared);
    }

    // Returns true if valid move
    private bool Move(Vector2Int translation)
    {
        Vector3 oldPos = transform.position;
        transform.position += (Vector3)(Vector3Int)translation;

        if (!IsValidPosition())
        {
            transform.position = oldPos;
            return false;
        }
        return true;
    }

    private bool Rotate(int direction)
    {
        // Store original rotation and position to revert
        Quaternion originalRotation = transform.rotation;
        Vector3 originalPosition = transform.position;

        // Apply rotation
        transform.Rotate(0, 0, direction * -90); // -90 for Z axis clockwise

        // Wall Kicks
        // SRS Wall Kicks implementation is complex.
        // For simplicity and robustness in this port:
        // 1. Try default.
        // 2. Try simple offset (left, right, up).
        
        if (IsValidPosition()) return true;

        // Try Wall Kicks from Data
        int wallKickIndex = GetWallKickIndex(direction); // 0-3 based on rotation state
        // This requires tracking rotation state index (0,1,2,3)
        // Let's implement a simpler "Push" mechanism for now.
        
        // Simple Wall Kick: Try kicking left, right, up
        if (TryKick(new Vector2Int(1, 0))) return true;
        if (TryKick(new Vector2Int(-1, 0))) return true;
        if (TryKick(new Vector2Int(0, 1))) return true; // Kick up (floor kick)
        if (TryKick(new Vector2Int(1, 1))) return true;
        if (TryKick(new Vector2Int(-1, 1))) return true;

        // Revert
        transform.position = originalPosition;
        transform.rotation = originalRotation;
        return false;
    }

    private bool TryKick(Vector2Int offset)
    {
        transform.position += (Vector3)(Vector3Int)offset;
        if (IsValidPosition())
        {
            return true;
        }
        transform.position -= (Vector3)(Vector3Int)offset;
        return false;
    }
    
    private int GetWallKickIndex(int rotationCallback)
    {
        // Placeholder for full SRS logic
        return 0;
    }

    private bool IsValidPosition()
    {
        foreach (Transform child in transform)
        {
            Vector2Int pos = Vector2Int.RoundToInt(child.position);
            if (!gridManager.IsValidPosition(pos))
            {
                return false;
            }
        }
        return true;
    }
}
