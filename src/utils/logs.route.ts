import express, { Request, Response } from "express";
import { logger } from "./logger.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get recent logs (Admin only)
router.get("/", authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const lines = parseInt(req.query.lines as string) || 100;
    const type = req.query.type as string || 'all';
    
    let logs: string[] = [];
    
    if (type === 'error') {
      logs = logger.getErrorLogs(lines);
    } else if (type === 'all') {
      logs = logger.getLogs(lines);
    }
    
    res.json({
      count: logs.length,
      type,
      logs
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

// Clear logs (Admin only)
router.delete("/", authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    logger.clearLogs();
    res.json({ message: 'Logs cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

export default router;
