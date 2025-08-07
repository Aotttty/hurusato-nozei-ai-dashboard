import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as React from "react";
import { ChatbotPopup } from "./index";

// モックの設定
jest.mock("lucide-react", () => ({
  MessageCircle: () => <div data-testid="message-circle-icon">MessageCircle</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Minimize2: () => <div data-testid="minimize-icon">Minimize2</div>,
  Maximize2: () => <div data-testid="maximize-icon">Maximize2</div>,
}));

describe("ChatbotPopup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render chatbot toggle button when closed", () => {
      render(<ChatbotPopup />);
      
      expect(screen.getByTestId("chatbot-toggle-button")).toBeInTheDocument();
      expect(screen.getByTestId("message-circle-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("chatbot-popup")).not.toBeInTheDocument();
    });

    it("should render chatbot popup when opened", () => {
      render(<ChatbotPopup />);
      
      // チャットボットを開く
      fireEvent.click(screen.getByTestId("chatbot-toggle-button"));
      
      expect(screen.getByTestId("chatbot-popup")).toBeInTheDocument();
      expect(screen.getByTestId("chatbot-iframe")).toBeInTheDocument();
      expect(screen.getByText("AI アシスタント")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should open chatbot when toggle button is clicked", () => {
      render(<ChatbotPopup />);
      
      const toggleButton = screen.getByTestId("chatbot-toggle-button");
      fireEvent.click(toggleButton);
      
      expect(screen.getByTestId("chatbot-popup")).toBeInTheDocument();
      expect(screen.getByTestId("chatbot-iframe")).toBeInTheDocument();
    });

    it("should close chatbot when close button is clicked", () => {
      render(<ChatbotPopup />);
      
      // チャットボットを開く
      fireEvent.click(screen.getByTestId("chatbot-toggle-button"));
      expect(screen.getByTestId("chatbot-popup")).toBeInTheDocument();
      
      // チャットボットを閉じる
      fireEvent.click(screen.getByTestId("chatbot-close-button"));
      expect(screen.queryByTestId("chatbot-popup")).not.toBeInTheDocument();
      expect(screen.getByTestId("chatbot-toggle-button")).toBeInTheDocument();
    });

    it("should minimize chatbot when minimize button is clicked", () => {
      render(<ChatbotPopup />);
      
      // チャットボットを開く
      fireEvent.click(screen.getByTestId("chatbot-toggle-button"));
      expect(screen.getByTestId("chatbot-iframe")).toBeInTheDocument();
      
      // チャットボットを最小化
      fireEvent.click(screen.getByTestId("chatbot-minimize-button"));
      expect(screen.queryByTestId("chatbot-iframe")).not.toBeInTheDocument();
      expect(screen.getByTestId("maximize-icon")).toBeInTheDocument();
    });

    it("should maximize chatbot when maximize button is clicked", () => {
      render(<ChatbotPopup />);
      
      // チャットボットを開く
      fireEvent.click(screen.getByTestId("chatbot-toggle-button"));
      
      // チャットボットを最小化
      fireEvent.click(screen.getByTestId("chatbot-minimize-button"));
      expect(screen.queryByTestId("chatbot-iframe")).not.toBeInTheDocument();
      
      // チャットボットを最大化
      fireEvent.click(screen.getByTestId("chatbot-minimize-button"));
      expect(screen.getByTestId("chatbot-iframe")).toBeInTheDocument();
      expect(screen.getByTestId("minimize-icon")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button roles", () => {
      render(<ChatbotPopup />);
      
      const toggleButton = screen.getByTestId("chatbot-toggle-button");
      expect(toggleButton).toHaveAttribute("role", "button");
    });

    it("should have proper iframe attributes", () => {
      render(<ChatbotPopup />);
      
      // チャットボットを開く
      fireEvent.click(screen.getByTestId("chatbot-toggle-button"));
      
      const iframe = screen.getByTestId("chatbot-iframe");
      expect(iframe).toHaveAttribute("frameBorder", "0");
      expect(iframe).toHaveAttribute("allow", "microphone");
      expect(iframe).toHaveAttribute("src", "https://udify.app/chatbot/emfaGOE4tbh5EZoN");
    });
  });

  describe("States", () => {
    it("should show toggle button when closed", () => {
      render(<ChatbotPopup />);
      
      expect(screen.getByTestId("chatbot-toggle-button")).toBeInTheDocument();
      expect(screen.queryByTestId("chatbot-popup")).not.toBeInTheDocument();
    });

    it("should show popup when opened", () => {
      render(<ChatbotPopup />);
      
      fireEvent.click(screen.getByTestId("chatbot-toggle-button"));
      
      expect(screen.getByTestId("chatbot-popup")).toBeInTheDocument();
      expect(screen.getByTestId("chatbot-iframe")).toBeInTheDocument();
    });

    it("should hide iframe when minimized", () => {
      render(<ChatbotPopup />);
      
      // チャットボットを開く
      fireEvent.click(screen.getByTestId("chatbot-toggle-button"));
      expect(screen.getByTestId("chatbot-iframe")).toBeInTheDocument();
      
      // 最小化
      fireEvent.click(screen.getByTestId("chatbot-minimize-button"));
      expect(screen.queryByTestId("chatbot-iframe")).not.toBeInTheDocument();
    });
  });
}); 