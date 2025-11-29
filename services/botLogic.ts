import { User } from '../types';
import { generateBotResponse } from './geminiService';

export const handleCommand = async (
  command: string, 
  args: string[], 
  user: User, 
  users: User[],
  updateUserXp: (userId: string, amount: number) => void
): Promise<string> => {
  
  switch (command.toLowerCase()) {
    case 'help':
      return `
**🤖 PromptBot Commands:**
/moeda - Flip a coin
/dado - Roll a D6
/slot - Play slots (Cost: 0, Win: 50 XP)
/xp - Check your XP
/ranking - Top 3 users
/vip - See VIP perks
      `.trim();

    case 'moeda':
      return Math.random() > 0.5 ? "🪙 **Heads!**" : "🪙 **Tails!**";

    case 'dado':
      return `🎲 You rolled a **${Math.floor(Math.random() * 6) + 1}**`;

    case 'slot':
      const icons = ['🍒', '🍋', '🍇', '💎', '7️⃣'];
      const r1 = icons[Math.floor(Math.random() * icons.length)];
      const r2 = icons[Math.floor(Math.random() * icons.length)];
      const r3 = icons[Math.floor(Math.random() * icons.length)];
      
      const result = `🎰 | ${r1} | ${r2} | ${r3} |`;
      
      if (r1 === r2 && r2 === r3) {
        updateUserXp(user.id, 50);
        return `${result} **JACKPOT!** (+50 XP)`;
      } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        updateUserXp(user.id, 10);
        return `${result} **Nice match!** (+10 XP)`;
      }
      return `${result} Better luck next time!`;

    case 'xp':
      return `📊 **${user.name}**\nLevel: ${user.level}\nXP: ${user.xp}`;

    case 'ranking':
      const sorted = [...users].sort((a, b) => b.xp - a.xp).slice(0, 3);
      let msg = "🏆 **Leaderboard**\n";
      sorted.forEach((u, i) => {
        msg += `${i+1}. ${u.name} (Lvl ${u.level})\n`;
      });
      return msg;

    case 'vip':
      return "⭐ **VIP Benefits**:\n- Unique Badge\n- Access to restricted channels\n- 2x XP Gain on slots\n- Priority Support";

    case 'ask':
      // General AI query
      const query = args.join(' ');
      if (!query) return "🤖 Usage: /ask [question]";
      return await generateBotResponse(query);

    default:
      return "🤖 Unknown command. Try /help.";
  }
};