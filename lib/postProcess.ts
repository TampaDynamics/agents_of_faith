export interface PostProcessedResponse {
  content: string;
  sections: {
    directAnswer: string;
    biblicalFoundation: string;
    historicalContext: string;
    theologicalImplications: string;
    practicalApplication: string;
    furtherStudy: string;
  };
  citations: string[];
  strongsReferences: string[];
  isValid: boolean;
  issues: string[];
}

export function postProcessResponse(content: string): PostProcessedResponse {
  const sections = extractSections(content);
  const citations = extractCitations(content);
  const strongsReferences = extractStrongsReferences(content);
  
  const issues = validateResponse(sections, citations);
  const isValid = issues.length === 0;
  
  return {
    content,
    sections,
    citations,
    strongsReferences,
    isValid,
    issues,
  };
}

function extractSections(content: string) {
  const sectionPatterns = {
    directAnswer: /(?:^|\n)(?:1\.\s*)?(?:Direct Answer|Answer)[:\s]*\n*(.*?)(?=\n(?:2\.|### 2|Biblical Foundation|Historical Context|Theological Implications|Practical Application|Further Study)|$)/is,
    biblicalFoundation: /(?:^|\n)(?:2\.\s*)?(?:Biblical Foundation|Scripture|Bible)[:\s]*\n*(.*?)(?=\n(?:3\.|### 3|Historical Context|Theological Implications|Practical Application|Further Study)|$)/is,
    historicalContext: /(?:^|\n)(?:3\.\s*)?(?:Historical Context|Context)[:\s]*\n*(.*?)(?=\n(?:4\.|### 4|Theological Implications|Practical Application|Further Study)|$)/is,
    theologicalImplications: /(?:^|\n)(?:4\.\s*)?(?:Theological Implications|Implications)[:\s]*\n*(.*?)(?=\n(?:5\.|### 5|Practical Application|Further Study)|$)/is,
    practicalApplication: /(?:^|\n)(?:5\.\s*)?(?:Practical Application|Application)[:\s]*\n*(.*?)(?=\n(?:6\.|### 6|Further Study)|$)/is,
    furtherStudy: /(?:^|\n)(?:6\.\s*)?(?:Further Study|Study)[:\s]*\n*(.*?)$/is,
  };

  const sections: any = {};
  
  Object.entries(sectionPatterns).forEach(([key, pattern]) => {
    const match = content.match(pattern);
    sections[key] = match && match[1] ? match[1].trim() : '';
  });

  return sections;
}

function extractCitations(content: string): string[] {
  // Match Bible references like "John 3:16", "Romans 8:28", etc.
  const citationPattern = /\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\s*of\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)\s+\d+(?::\d+(?:-\d+)?)?/gi;
  
  const citations = content.match(citationPattern) || [];
  return [...new Set(citations)]; // Remove duplicates
}

function extractStrongsReferences(content: string): string[] {
  // Match Strong's numbers like "G1234" or "H1234"
  const strongsPattern = /[GH]\d+/g;
  const strongsRefs = content.match(strongsPattern) || [];
  return [...new Set(strongsRefs)]; // Remove duplicates
}

function validateResponse(sections: Record<string, string>, citations: string[]): string[] {
  const issues: string[] = [];
  
  // Check if all sections are present and have content
  Object.entries(sections).forEach(([key, content]) => {
    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      issues.push(`Section '${key}' is missing or too short`);
    }
  });
  
  // Check if there are sufficient citations
  if (citations.length < 2) {
    issues.push('Response should include at least 2 Bible references');
  }
  
  // Check for specific required citations
  const hasOldTestament = citations.some(citation => 
    /^(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\s*of\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)/i.test(citation)
  );
  
  const hasNewTestament = citations.some(citation => 
    /^(Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)/i.test(citation)
  );
  
  if (!hasOldTestament && !hasNewTestament) {
    issues.push('Response should include both Old and New Testament references when relevant');
  }
  
  return issues;
}
