import React, { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';

import classnames from 'classnames';

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [codeContent, setCodeContent] = useState("");

  function fixInvalidJSON(jsonString) {
    let nestingLevel = 0;
    let fixedString = '';
  
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString[i];
  
      if (char === '[') nestingLevel++;
      if (char === ']') nestingLevel--;
  
      if ((char === ',' && nestingLevel === 0 && (jsonString[i + 1] === ' ' || jsonString[i + 1] === ']')) || (char === ',' && nestingLevel === 1 &&
        (jsonString[i + 1] === ' ' || jsonString[i + 1] === '}')) || (char === ',' && nestingLevel > 1 && jsonString[i + 1] === ' ')
      ) {
        // Skip the extra comma
        continue;
      } else {
        fixedString += char;
      }
    }
  
    return fixedString;
  }

  function fixExtraClosingBrackets(jsonString) {
    let openBracketCount = 0;
    let closingBracketCount = 0;
    let fixedString = '';
  
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString[i];
  
      if (char === '[') {
        openBracketCount++;
      } else if (char === ']') {
        closingBracketCount++;
      }
  
      // Check if there's an extra closing bracket
      if (closingBracketCount > openBracketCount) {
        // Find the position of the last closing bracket before the extra one
        const lastClosingBracketIndex = fixedString.lastIndexOf(']');
  
        // If there's a previous closing bracket, insert an opening bracket before it
        if (lastClosingBracketIndex !== -1) {
          fixedString = fixedString.slice(0, lastClosingBracketIndex) + '[' + fixedString.slice(lastClosingBracketIndex);
          // If there's no previous closing bracket, this is likely a genuine extra closing bracket - remove it
        } else {
          fixedString = fixedString.slice(0, fixedString.length - 1); // Remove the extra closing bracket
        }
  
        // Reset closing bracket count
        closingBracketCount--;
      } else {
        fixedString += char;
      }
    }
  
    return fixedString;
  }

  function cleanJSON2(jsonString) {
    const lines = jsonString.split('\n');
    let cleanedLines = [lines[0].trim().replace(/\n/g, '\\n')];

    const regexPatterns = {
      openCurlyBracket: /^\s*\{/, 
      roleKey: /^\s*"role":\s*"[^"]*",/,
      partsKey: /^\s*"parts":\s*\[/,
      filesArray: /^\s*files\[[0-9]*\],/, 
      closingSquareBracket: /^\s*\],/, 
      closingCurlyBracketWithComma: /^\s*\}/,
    };

    for (let i = 1; i < lines.length-1; i++) {
      let line = lines[i].trim().replace(/\n/g, '\\n'); // Remove leading/trailing whitespace
      if (regexPatterns.openCurlyBracket.test(line)) { //'   {'
        cleanedLines.push(line);
      } else if (regexPatterns.roleKey.test(line)) { //'   "role": "user",'
        cleanedLines.push(line);
      } else if (regexPatterns.partsKey.test(line)) { //'    "parts": ['
        cleanedLines.push(line);
      } else if (regexPatterns.filesArray.test(line)) { //'     files[0],'
      } else if (regexPatterns.closingSquareBracket.test(line)) { //'    ],'
        line = line.slice(0, -1);
        cleanedLines.push(line);
      } else if (regexPatterns.closingCurlyBracketWithComma.test(line)) { //'   },'
        if (i === lines.length - 2) {
          line = line.slice(0, -1);
        }
        cleanedLines.push(line);
      } else { // normal line of text
        line = line.slice(0, -1);
        cleanedLines.push(line);
      }
    }


    cleanedLines.push(lines[lines.length-1].trim().replace(/\n/g, '\\n'));
  
    return cleanedLines.join('\n'); // Join the lines back into a single string
  }

  function cleanJSON(jsonString) {
    const lines = jsonString.split('\n');
    let cleanedLines = [lines[0].trim().replace(/\n/g, '\\n')];
  
    for (let i = 1; i <= lines.length-7; i+=6) {
      let line = lines[i].trim().replace(/\n/g, '\\n'); // Remove leading/trailing whitespace
      let line2 = lines[i+1].trim().replace(/\n/g, '\\n'); // Remove leading/trailing whitespace
      let line3 = lines[i+2].trim().replace(/\n/g, '\\n'); // Remove leading/trailing whitespace
      let line4 = lines[i+3].trim().replace(/\n/g, '\\n'); // Remove leading/trailing whitespace
      let line5 = lines[i+4].trim().replace(/\n/g, '\\n'); // Remove leading/trailing whitespace
      let line6 = lines[i+5].trim().replace(/\n/g, '\\n'); // Remove leading/trailing whitespace
      // console.log(i, line);
      // console.log(i+1, line2);
      // console.log(i+2, line3);
      // console.log(i+3, line4);
      // console.log(i+4, line5);
      // console.log(i+5, line6);

      line4 = line4.slice(0, -1);
      line5 = line5.slice(0, -1);

      cleanedLines.push(line);
      cleanedLines.push(line2);
      cleanedLines.push(line3);
      cleanedLines.push(line4);
      cleanedLines.push(line5);
      if (i === lines.length - 7) {
        // console.log("last line6", line6);
        line6 = line6.slice(0, -1);
        // console.log("last line6", line6);
      }
      cleanedLines.push(line6);
    }
    cleanedLines.push(lines[lines.length-1].trim().replace(/\n/g, '\\n'));
  
    return cleanedLines.join('\n'); // Join the lines back into a single string
  }

  // useEffect(() => {
  //   fetch(data3)
  //     .then(response => response.text())
  //     .then(fileContents => {
  //       // console.log("fileContents", fileContents);
        
  //       // const startIndex = fileContents.indexOf('[');
  //       // Find the first '[' after "history"
  //       const startIndex = fileContents.indexOf('[', fileContents.indexOf('history') + 'history'.length);
  //       console.log("startIndex", startIndex);
  //       const endIndex = fileContents.lastIndexOf(']');
  //       console.log("endIndex", endIndex);
  //       const jsonString = fileContents.substring(startIndex, endIndex + 1);
  //       // console.log("jsonString", jsonString);

  //       const fixedJSON = cleanJSON(jsonString);
  //       // console.log("fixedJSON", fixedJSON);

  //       const parsedData = JSON.parse(fixedJSON);
  //       setJsonData(parsedData);
  //     })
  //     .catch(error => console.error('Error fetching data.txt:', error));
  // }, []);

  // Helper function from previous response (adapted to work with string input)
  // function extractAndParseJSON(fileContents) {
  //   try {
  //     const startIndex = fileContents.indexOf('[', fileContents.indexOf('history') + 'history'.length);
  //     console.log("startIndex", startIndex);
  //     const endIndex = fileContents.lastIndexOf(']');
  //     console.log("endIndex", endIndex);
  //     const jsonString = fileContents.substring(startIndex, endIndex + 1);
  //     console.log(jsonString);
  //     return JSON.parse(jsonString);
  //   } catch (error) {
  //     console.error('Error parsing file:', error);
  //     return null;
  //   }
  // }

  function splitStringByTripleTicks(str) {
    const result = [];
    let currentSection = "";
    let insideCodeBlock = false;
  
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
  
      if (char === '`' && i + 2 < str.length && str[i + 1] === '`' && str[i + 2] === '`') {
        // Found "```" - toggle code block state
        insideCodeBlock = !insideCodeBlock;
        if (insideCodeBlock) {
          // Starting a new code block, add previous section
          if (currentSection !== "") result.push(currentSection);
          currentSection = "```"; // Start new code block
        } else {
          // Ending a code block, add it and reset
          currentSection += "```";
          result.push(currentSection);
          currentSection = ""; 
        }
        i += 2; // Skip the next two '`' characters
      } else {
        currentSection += char;
      }
    }
  
    // Add any remaining section
    if (currentSection) {
      result.push(currentSection);
    }
  
    return result;
  }

  function splitStringBySeparator(str, separator) {
    const result = [];
    let currentSection = "";
    let insideCodeBlock = false;
  
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
  
      if (char === separator) {
        // Found "```" - toggle code block state
        insideCodeBlock = !insideCodeBlock;
        if (insideCodeBlock) {
          // Starting a new code block, add previous section
          if (currentSection !== "") result.push(currentSection);
          currentSection = separator; // Start new code block
        } else {
          // Ending a code block, add it and reset
          currentSection += separator;
          result.push(currentSection);
          currentSection = ""; 
        }
        // i += 2; // Skip the next two '`' characters
      } else {
        currentSection += char;
      }
    }
  
    // Add any remaining section
    if (currentSection) {
      result.push(currentSection);
    }
  
    return result;
  }

  function leadingSpaces(str) { return str.match(/^\s*/)[0].length; }

  function getPaddingClass(leading) { return `pl-[${leading}px]`; }

  function extractFunctionDetails(line) {
    const functionName = line.match(/def\s+(\w+)/)[1];
    const parameters = line.match(/\((.*?)\)/)[1].split(",").map(param => param.trim());
    return [functionName, parameters];
  }

  function CodeHighlighter(props) {
    const code = props.line;
    const tailwindClasses = props.tailwindClasses;
    let leading = leadingSpaces(code);
    // console.log("leading", leading + "px");
    let leadingTW = leading + `px`;
    // console.log("leadingTW", leadingTW);

    const tokens = code.split(/\s+/); // A very basic tokenizer
    // console.log("tokens", tokens);
    const highlightedCode = tokens.map((token) => {
      if (token === "") return null; // Skip empty tokens
      // Simplified semantic analysis
      let tokenClass = "punctuation"; // Default to punctuation
      if (token === "def" || token === "return" || token === "int" || token === "str") {
        tokenClass = "keyword";
      } else if (token === "add_reversed_numbers" || token === "reverse_digits") {
        tokenClass = "identifier";
      } else if (token.match(/^[0-9]+$/)) { // Very basic check for numbers
        tokenClass = "literal";
      } else if (token === "+" || token === "=") {
        tokenClass = "operator";
      }
      return <span key={token} className={classnames(`${tailwindClasses[tokenClass]}`)}>{token} </span>;
    });
  
    return (
      <pre className={classnames(`flex flex-row bg-gra-100`)} style={{ backgroundColor: 'gray-100', paddingLeft: `${leading * 8}px` }}>
        {highlightedCode}
      </pre>
    );
  }

  function parseFunctionDefLine(line) {

  }

  function parsePythonLine(line) {
    if (line === "") return <br></br>
    const trimmedLine = line.trim();
    const isFunctionDefLine = trimmedLine.match(/^\s*def\s+/);

    const tailwindClasses = {
      "keyword": "text-blue-500 font-bold",
      "identifier": "text-purple-500",
      "literal": "text-green-500",
      "operator": "text-red-500",
      "punctuation": "text-gray-500",
    };

    if (isFunctionDefLine) {
      const [functionName, parameters] = extractFunctionDetails(trimmedLine);
      // console.log("functionName", functionName);
      // console.log("parameters", parameters);
      return (
        <div className={classnames(`flex flex-row bg-gra-100`)}>
          <span className={classnames(tailwindClasses.keyword)} style={{marginRight: "0px"}}>def</span>
          <div className="w-2"></div>
          <span className={classnames(tailwindClasses.identifier)} style={{marginRight: "0px"}}>{functionName}</span>
          <span className={classnames(tailwindClasses.punctuation)}>(</span>
          {parameters.map((param, index) => (
            <span key={index} className={classnames(`${tailwindClasses.identifier} ${(index < parameters.length - 1) && 'mr-[5px]'}`)}>
              {param}
              {index < parameters.length - 1 && ", "}
            </span>
          ))}
          <span className={classnames(tailwindClasses.punctuation)}>):</span>
        </div>
      )
    }
    // let leading = leadingSpaces(line);
    // let nextSpaceIndex = str.indexOf(' ', leadingSpaces);
    // let firstString = line.substring(leadingSpaces, nextSpaceIndex);
    // if (firstString == "def") {

    // }
    // console.log("about to use code highlighter on", line);
    return <CodeHighlighter line={line} tailwindClasses={tailwindClasses} />;
  }
  function parseCodeBlock(codeBlock) {
    let language = codeBlock.substring(3, codeBlock.indexOf('\n')).trim();
    // console.log("language", language);
    let code = codeBlock.substring(codeBlock.indexOf('\n') + 1, codeBlock.length - 3).trim();
    // console.log("code", code);
    let lines = code.split('\n');
    // console.log("parseCodeBlock lines", lines);
    return (
      <div className={classnames(`bg-gray-100 rounded-[10px] overflow-hidden flex flex-col mb-[20px]`)}>
        <div className={classnames(`p-[15px]`)}>
          {
            lines.map(line => parsePythonLine(line))
          }
        </div>
        
        <div className={classnames(`flex flex-row justify-between px-[10px] py-[15px] bg-[gray]`)}>
          <div className={classnames(`flex flex-row`)}>
            <button className={classnames(`flex flex-row mr-[15px]`)}>
              <img src="./copy-text.png" alt="C" className={classnames(`flex flex-row w-[20px] h-auto`)}/>
            </button>
            <h6 className={classnames(``)}>Use code <span className={classnames(`text-[blue]`)}>with caution</span></h6>
          </div>
          <h6>{language}</h6>
        </div>
      </div>
    )
  }

  function ContentHighlighter(props) {
    const line = props.line;
    const tailwindClasses = props.tailwindClasses;
    let leading = leadingSpaces(line);
    let tokens = splitStringBySeparator(line, '`');
    let num = tokens[0].substring(leading, tokens[0].indexOf('.'));

    const highlightedContent = tokens.map((token) => {
      if (token === "") return null;
      return <span>{token}</span>
    });

    return (
      <pre className={classnames(`flex flex-row bg-gra-100 ${num === 1 && 'mt-[5px]'}`)} style={{ backgroundColor: 'gray-100', paddingLeft: `${leading * 8}px` }}>
        {highlightedContent}
      </pre>
    );
  }

  function parseContentLine(content) {
    if (content === "") return <br></br>
    let leading = leadingSpaces(content);
    // console.log(leading, content);

    // return (
    //   <div className={classnames(`flex flex-row`)}>
    //     {
    //       content.map((token, index) => (
    //         <span key={index} className={classnames(`text-[white]`)}>{token}</span>
    //       ))
    //     }
    //   </div>
    // );
    return <ContentHighlighter line={content} tailwindClasses={{}} />;
    // for (let token of tokens) {
    //   if (leading === 0) {
    //     if (/^\+?(0|[1-9]\d*)$/.test(content.substring(0, content.indexOf('.')))) { // there's a number at beginning (indicating a list)
    //       return <h6 className="text-[white]">{content.substring(content.indexOf('.')+1)}</h6>
    //     }
    //   } else if (leading === 3) {
    //     return <h6 className="text-[white]">{content}</h6>
    //   }
    // }
  }

  function parseContentBlock(content) {
    let groups = content.split('\n');
    // console.log("parseContent groups", groups);

    let numEmpty = 0;
    let leading = 0;
    let renderedContent = [];

    return (
      <div>
        {
          groups.map(group => parseContentLine(group))
        }
      </div>
    );
  }

  function parseModel(partString) {
    let groups = splitStringByTripleTicks(partString);
    // console.log("parseModel groups", groups);

    let renderedContent = [];
    for (let g of groups) {
      if (g.startsWith("```")) {
        renderedContent.push(parseCodeBlock(g));
      } else {
        renderedContent.push(parseContentBlock(g));
      }
    }
    return renderedContent;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContents = e.target.result;
      // console.log("fileContents", fileContents);

      // Find the first '[' after "history"
      const startIndex = fileContents.indexOf('[', fileContents.indexOf('history') + 'history'.length);
      // console.log("startIndex", startIndex);
      console.log(fileContents[startIndex]);
      const endIndex = fileContents.lastIndexOf(']');
      // console.log("endIndex", endIndex);
      console.log(fileContents[endIndex]);
      const jsonString = fileContents.substring(startIndex, endIndex + 1);
      // console.log("jsonString", jsonString);

      const fixedJSON = cleanJSON2(jsonString);
      // console.log("fixedJSON", fixedJSON);

      const parsedData = JSON.parse(fixedJSON);
      setJsonData(parsedData);
      setCodeContent(fixedJSON); // Update codeContent with the cleaned JSON
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="border border-gray-400 p-2 rounded"
      />
      {jsonData && (
        <div>
          <h2>Parsed JSON Content:</h2>
          {jsonData.map((item, index) => (
            <div key={index} className={classnames(`flex flex-col px-[5px] py-[2px] bg-[red mb-[15px]`)}>
              <div className={classnames(`flex flex-row`)}>
                <h3 className={classnames(`${item.role === "user" ? 'bg-[green]' : 'bg-[blue]'} px-[9px] py-[5px rounded-full mb-[5px]`)}>{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</h3>
              </div>
              <div>
                {parseModel(item.parts[0])}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;