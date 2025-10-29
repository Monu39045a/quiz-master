import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Quiz {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  num_questions: number;
  duration_minutes: number;
  status: string;
  trainer_id: string;
}

const initaialState = {
  id: 0,
  title: "",
  start_time: "",
  end_time: "",
  num_questions: 0,
  duration_minutes: 0,
  status: "",
  trainer_id: "",
};

const quizSlice = createSlice({
  name: "quiz",
  initialState: initaialState,
  reducers: {
    setQuizDetails: (state, action: PayloadAction<Quiz>) => {
      return { ...state, ...action.payload };
    },
    clearQuizDetails: () => initaialState,
  },
});

export const { setQuizDetails, clearQuizDetails } = quizSlice.actions;
export default quizSlice.reducer;
