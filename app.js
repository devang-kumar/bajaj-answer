import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
const app = express();
app.use(express.json());
const EMAIL = process.env.OFFICIAL_EMAIL;
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
function gcd(a, b) {
  while (b !== 0) {
    a = a % b;
    [a, b] = [b, a];
  }
  return a;
}
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);
    if (keys.length !== 1) {
      return res.status(400).json({ is_success: false });
    }
    let data;
    if (body.fibonacci !== undefined) {
      let n = body.fibonacci;
      let fib = [];
      for (let i = 0; i < n; i++) {
        fib.push(i < 2 ? i : fib[i - 1] + fib[i - 2]);
      }
      data = fib;
    }
    else if (body.prime !== undefined) {
      let arr = body.prime;
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        if (isPrime(arr[i])) result.push(arr[i]);
      }
      data = result;
    }
    else if (body.lcm !== undefined) {
      let arr = body.lcm;
      let result = arr[0];
      for (let i = 1; i < arr.length; i++) {
        result = lcm(result, arr[i]);
      }
      data = result;
    }
    else if (body.hcf !== undefined) {
      let arr = body.hcf;
      let result = arr[0];
      for (let i = 1; i < arr.length; i++) {
        result = gcd(result, arr[i]);
      }
      data = result;
    }
    else if (body.AI !== undefined) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Answer in one word only. " + body.AI
                  }
                ]
              }
            ]
          })
        }
      );
      const result = await response.json();
      data = result.candidates[0].content.parts[0].text.split(" ")[0];
    }
    else {
      return res.status(400).json({ is_success: false });
    }
    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });
  } catch (err) {
    res.status(500).json({ is_success: false });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


