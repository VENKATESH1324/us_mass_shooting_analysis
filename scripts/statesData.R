if(i<r-1 && j<c-1 && (grid[i+1][j+1]-grid[i][j]>3))
            return dp[i][j] = 1+ findLongestSeqFromPoint(i+1,j+1,grid,dp);
        if(j>0 && i>0 && (grid[i][j]-grid[i-1][j-1]>3))
            return dp[i][j] = 1+ findLongestSeqFromPoint(i-1,j-1,grid,dp);
			
			
			//final working code