using UnityEngine;

public class GridManager : MonoBehaviour
{
    // Matching the React implementation: 12 Width, 20 Height
    public int width = 12;
    public int height = 20;

    // Grid stores the Transform of the blocks
    public Transform[,] grid;

    private void Awake()
    {
        grid = new Transform[width, height];
    }

    public bool IsValidPosition(Vector2Int position)
    {
        // 1. Check bounds
        if (position.x < 0 || position.x >= width || position.y < 0)
        {
            return false;
        }

        // 2. Check if occupied
        // Note: We allow y >= height because pieces spawn above the board
        if (position.y < height && grid[position.x, position.y] != null)
        {
            return false;
        }

        return true;
    }

    public bool IsInsideGrid(Vector2Int position)
    {
        return position.x >= 0 && position.x < width && position.y >= 0;
    }

    public void AddToGrid(Transform piece)
    {
        foreach (Transform children in piece)
        {
            int x = Mathf.RoundToInt(children.position.x);
            int y = Mathf.RoundToInt(children.position.y);

            if (x >= 0 && x < width && y >= 0 && y < height)
            {
                grid[x, y] = children;
            }
        }
    }

    public int ClearLines()
    {
        int linesCleared = 0;

        // Check from bottom up
        for (int y = 0; y < height; y++)
        {
            if (IsLineFull(y))
            {
                DeleteLine(y);
                DecreaseRowsAbove(y + 1);
                y--; // Re-check this row index as rows shifted down
                linesCleared++;
            }
        }

        return linesCleared;
    }

    private bool IsLineFull(int y)
    {
        for (int x = 0; x < width; x++)
        {
            if (grid[x, y] == null)
            {
                return false;
            }
        }
        return true;
    }

    private void DeleteLine(int y)
    {
        for (int x = 0; x < width; x++)
        {
            if (grid[x, y] != null)
            {
                Destroy(grid[x, y].gameObject);
                grid[x, y] = null;
            }
        }
    }

    private void DecreaseRowsAbove(int yStart)
    {
        for (int y = yStart; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                if (grid[x, y] != null)
                {
                    // Move in data
                    grid[x, y - 1] = grid[x, y];
                    grid[x, y] = null;

                    // Move visually
                    grid[x, y - 1].position += Vector3.down;
                }
            }
        }
    }
}
