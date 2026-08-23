export const QUESTIONS = [
  { id:'self-choice', pillar:'Self', depth:1, states:['open','hopeful','distant'], text:'What feels most like you today?', intent:'identity', type:'choice', choices:['Silly','Serious','Quiet','Curious','Tender','Restless'] },
  { id:'self-1', pillar:'Self', depth:2, states:['open','hopeful','distant'], text:'When did you feel most like yourself today?', intent:'identity', type:'text' },
  { id:'presence-1', pillar:'Presence', depth:1, states:['open','heavy','distant','hopeful'], text:'What did you notice today that you might normally have missed?', intent:'notice', type:'text' },
  { id:'energy-choice', pillar:'Energy', depth:1, states:['heavy','distant','open'], text:'What do you need more of right now?', intent:'energy', type:'choice', choices:['Rest','Space','Connection','Movement','Quiet','Fun'] },
  { id:'home-1', pillar:'Home', depth:2, states:['heavy','distant'], text:'Where did today feel easier on your nervous system?', intent:'ease', type:'text' },
  { id:'wonder-1', pillar:'Wonder', depth:2, states:['open','hopeful'], text:'What has been quietly fascinating you lately?', intent:'curiosity', type:'text' },
  { id:'energy-1', pillar:'Energy', depth:1, states:['heavy','distant'], text:'What took more out of you today than it seemed like it should?', intent:'energy', type:'text' },
  { id:'connection-1', pillar:'Connection', depth:2, states:['open','heavy','hopeful'], text:'When did you feel genuinely connected to someone today?', intent:'connection', type:'text' },
  { id:'comfort-choice', pillar:'Comfort', depth:1, states:['heavy','distant'], text:'What would feel kindest right now?', intent:'ground', type:'choice', choices:['Less noise','Less responsibility','Closeness','Space','Rest','I’m not sure'] },
  { id:'remembrance-1', pillar:'Remembrance', depth:2, states:['heavy','distant','open','hopeful'], text:'Is there someone — human or animal — you are missing today?', intent:'grief', type:'text' },
  { id:'remembrance-2', pillar:'Remembrance', depth:2, states:['open','heavy','distant'], text:'What is one tiny thing about them you never want time to smooth away?', intent:'grief', type:'text' },
  { id:'growth-1', pillar:'Growth', depth:3, states:['open','hopeful'], text:'What truth about yourself has been getting harder to ignore?', intent:'growth', type:'text' },
  { id:'play-1', pillar:'Wonder', depth:1, states:['open','hopeful'], text:'What made you laugh, play, or feel a little lighter today?', intent:'play', type:'text' },
  { id:'ease-2', pillar:'Home', depth:2, states:['open','hopeful','heavy'], text:'What felt natural today — like you did not have to force it?', intent:'ease', type:'text' }
];

export const ARRIVAL_OPTIONS = [
  ['open','🍃','Open'],
  ['heavy','🌧','Heavy'],
  ['distant','🌫','Distant'],
  ['hopeful','🌅','Hopeful']
];
