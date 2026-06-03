const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Add Sheet State
code = code.replace(
  '  const [campaignSearch, setCampaignSearch] = useState("");',
  `  const [campaignSearch, setCampaignSearch] = useState("");
  const [sheetColumns, setSheetColumns] = useState<string[]>(['Phone Number', 'Name']);
  const [sheetData, setSheetData] = useState<Record<string, string>[]>([
    { 'Phone Number': '', 'Name': '' }
  ]);
  const [newColumnName, setNewColumnName] = useState("");`
);

// 2. Remove campaignNumbers, campaignContextRows, showContextBuilder
code = code.replace(/  const \[campaignNumbers, setCampaignNumbers\] = useState\(""\);\n/, '');
code = code.replace(/  \/\/ Context Builder State.*?\n/, '');
code = code.replace(/  const \[campaignContextRows, setCampaignContextRows\] = useState<\{key: string; value: string\}\[\]>\(\[\]\);\n/, '');
code = code.replace(/  const \[showContextBuilder, setShowContextBuilder\] = useState\(false\);\n/, '');

// 3. Add handlers
const handlers = `  const handleDownloadTemplate = () => {
    const header = sheetColumns.join(",");
    const csvContent = "data:text/csv;charset=utf-8," + header + "\\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "campaign_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\\n").filter(row => row.trim());
      if (rows.length === 0) return;
      const columns = rows[0].split(",").map(c => c.trim());
      if (!columns.includes("Phone Number")) {
        toast.error("CSV must contain a 'Phone Number' column");
        return;
      }
      setSheetColumns(columns);
      const data: Record<string, string>[] = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",").map(v => v.trim());
        const rowData: Record<string, string> = {};
        columns.forEach((col, index) => {
          rowData[col] = values[index] || "";
        });
        data.push(rowData);
      }
      setSheetData(data.length > 0 ? data : [{ 'Phone Number': '' }]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {`;
code = code.replace('  const handleLaunchCampaign = async (e: React.FormEvent) => {', handlers);

// 4. Update launch payload logic
const payloadOriginal = `    e.preventDefault();
    if (!campaignName || !campaignNumbers) {
      toast.error("Campaign name and phone numbers are required");
      return;
    }
    if (campaignMode === 'ai' && !campaignAgent) {
      toast.error("Please select an AI agent");
      return;
    }
    if (campaignMode === 'tts' && !campaignText) {
      toast.error("Please enter the message text for TTS");
      return;
    }
    if (campaignMode === 'audio' && !campaignCloudUrl) {
      toast.error("Please enter a Cloudinary audio URL");
      return;
    }

    // Parse numbers (split by comma, newline, semicolon)
    const numbers = campaignNumbers
      .split(/[\\n,;]+/)
      .map(n => n.trim().replace(/\\D/g, ''))
      .filter(n => n.length >= 10);

    if (numbers.length === 0) {
      toast.error("No valid phone numbers found (minimum 10 digits)");
      return;
    }

    // Build base payload — company_id is automatically injected by apiClient.launchCampaign
    const basePayload: any = { numbers };

    if (campaignMode === 'tts') {
      basePayload.text = campaignText;
      basePayload.provider = campaignTtsProvider;
      // Pass specific Chirp3-HD voice for Google TTS campaigns
      if (campaignTtsProvider === 'google' && campaignGoogleVoice) {
        basePayload.voice_name = campaignGoogleVoice;
      }
    }
    if (campaignMode === 'audio') {
      basePayload.cloudUrl = campaignCloudUrl;
    }
    if (campaignMode === 'ai') {
      // agent_id: UUID of the outbound AI agent to use
      basePayload.agent_id = campaignAgent || null;
      // context: flat key-value object injected into the AI system prompt
      const contextObj: Record<string, string> = {};
      campaignContextRows.forEach(row => {
        const k = row.key.trim();
        const v = row.value.trim();
        if (k && v) contextObj[k] = v;
      });
      if (Object.keys(contextObj).length > 0) {
        basePayload.context = contextObj;
      }
    }`;

const payloadNew = `    e.preventDefault();
    if (!campaignName) {
      toast.error("Campaign name is required");
      return;
    }
    
    const validContacts = sheetData.filter(row => row['Phone Number'] && row['Phone Number'].trim().length >= 10);
    
    if (validContacts.length === 0) {
      toast.error("No valid phone numbers found in sheet (minimum 10 digits)");
      return;
    }

    if (campaignMode === 'ai' && !campaignAgent) {
      toast.error("Please select an AI agent");
      return;
    }
    if (campaignMode === 'tts' && !campaignText) {
      toast.error("Please enter the message text for TTS");
      return;
    }
    if (campaignMode === 'audio' && !campaignCloudUrl) {
      toast.error("Please enter a Cloudinary audio URL");
      return;
    }

    const numbers = validContacts.map(c => c['Phone Number'].trim().replace(/\\D/g, ''));
    const contacts = validContacts.map(c => {
      const { 'Phone Number': phone, ...context } = c;
      return {
        number: phone.trim().replace(/\\D/g, ''),
        context
      };
    });

    const basePayload: any = { numbers, contacts };

    if (campaignMode === 'tts') {
      basePayload.text = campaignText;
      basePayload.provider = campaignTtsProvider;
      if (campaignTtsProvider === 'google' && campaignGoogleVoice) {
        basePayload.voice_name = campaignGoogleVoice;
      }
    }
    if (campaignMode === 'audio') {
      basePayload.cloudUrl = campaignCloudUrl;
    }
    if (campaignMode === 'ai') {
      basePayload.agent_id = campaignAgent || null;
    }`;

if (!code.includes(payloadOriginal)) {
  console.log("Could not find payload original!");
  process.exit(1);
}
code = code.replace(payloadOriginal, payloadNew);

// Remove state resets in the success block
code = code.replace(/      setCampaignNumbers\(""\);\n/, '');
code = code.replace(/      setCampaignContextRows\(\[\]\);\n/, '');
code = code.replace(/      setShowContextBuilder\(false\);\n/, '');

// 5. Replace UI
const uiOriginalRegex = /\{\/\* Phone Numbers \*\/\}[\s\S]*?\{\/\* === TTS Mode === \*\/\}/;
const uiNew = `{/* Campaign Data Sheet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Campaign Contacts & Context</label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleDownloadTemplate} className="h-7 text-xs">
                    <Download className="mr-1 h-3 w-3" /> Template
                  </Button>
                  <label className="cursor-pointer">
                    <input type="file" accept=".csv" className="hidden" onChange={handleUploadTemplate} />
                    <div className="h-7 px-3 text-xs inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                      <Upload className="mr-1 h-3 w-3" /> Upload
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="border rounded-md overflow-x-auto max-w-full">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2 whitespace-nowrap w-10"></th>
                      {sheetColumns.map((col, idx) => (
                        <th key={idx} className="px-3 py-2 whitespace-nowrap min-w-[120px]">
                          <div className="flex items-center justify-between">
                            <span>{col}</span>
                            {col !== 'Phone Number' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newCols = sheetColumns.filter((_, i) => i !== idx);
                                  setSheetColumns(newCols);
                                  const newData = sheetData.map(row => {
                                    const newRow = { ...row };
                                    delete newRow[col];
                                    return newRow;
                                  });
                                  setSheetData(newData);
                                }}
                                className="text-destructive hover:opacity-80"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-3 py-2 whitespace-nowrap w-[150px]">
                        <div className="flex gap-1">
                          <Input 
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            placeholder="New column"
                            className="h-6 text-xs w-24"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              if (newColumnName && !sheetColumns.includes(newColumnName)) {
                                setSheetColumns([...sheetColumns, newColumnName]);
                                setNewColumnName("");
                              }
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-3 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => setSheetData(sheetData.filter((_, i) => i !== rIdx))}
                            className="text-destructive hover:opacity-80 disabled:opacity-30"
                            disabled={sheetData.length === 1}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </td>
                        {sheetColumns.map((col, cIdx) => (
                          <td key={cIdx} className="px-2 py-1">
                            <Input
                              value={row[col] || ""}
                              onChange={(e) => {
                                const newData = [...sheetData];
                                newData[rIdx] = { ...newData[rIdx], [col]: e.target.value };
                                setSheetData(newData);
                              }}
                              className="h-7 text-xs border-transparent hover:border-input focus:border-input bg-transparent"
                              placeholder={col === 'Phone Number' ? '9876543210' : ''}
                            />
                          </td>
                        ))}
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  {sheetData.filter(r => r['Phone Number'] && r['Phone Number'].length >= 10).length} valid numbers
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSheetData([...sheetData, { 'Phone Number': '' }])}
                  className="h-7 text-xs text-primary"
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Row
                </Button>
              </div>
            </div>

            {/* === AI Calling Mode === */}
            {campaignMode === 'ai' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">AI Agent</label>
                <Select value={campaignAgent} onValueChange={setCampaignAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {agents && agents.length > 0 ? agents.map((a: any) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name}
                        <span className="ml-2 text-[10px] font-mono text-muted-foreground">({String(a.id).slice(0, 8)}…)</span>
                      </SelectItem>
                    )) : (
                      <SelectItem value="__none" disabled>No agents available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Agent handles live 2-way conversation using Gemini AI</p>
              </div>
            )}

            {/* === TTS Mode === */}`;

if (!uiOriginalRegex.test(code)) {
  console.log("Could not find UI original!");
  process.exit(1);
}
code = code.replace(uiOriginalRegex, uiNew);

// Add Upload import
code = code.replace('Download, ChevronLeft', 'Download, Upload, ChevronLeft');

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log("Patch successful!");
