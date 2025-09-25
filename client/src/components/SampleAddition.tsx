import { useState } from "react";
import { addNumbers } from "../api/sampleAdditionApi";

function SampleAddition() {
  const [num1, setNum1] = useState<number | null>(null);
  const [num2, setNum2] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const handleAddition = async () => {
    if (num1 !== null && num2 !== null) {
      try {
        const result = await addNumbers(num1, num2);
        setResult(result?.sum);
      } catch (error) {
        console.error("Error calling the API", error);
      }
    }
  };

  return (
    <div>
      <h3>sample addition calculator</h3>
      <input
        type="number"
        value={num1 ?? ""}
        onChange={(e) => setNum1(Number(e.target.value))}
      />
      <input
        style={{ marginLeft: "10px" }}
        type="number"
        value={num2 ?? ""}
        onChange={(e) => setNum2(Number(e.target.value))}
      />
      <button style={{ marginLeft: "10px" }} onClick={handleAddition}>
        Add
      </button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}

export default SampleAddition;
